<template>
    <div class="lv">
        <div class="lv-top flex-col md:flex-row text-[18px] p-4">
            <div class="hidden md:block lv-title normal-font">Validation <span class="muted">Form</span></div>
            <div class="lv-actions">
                <select v-model="presetKey" class="select cursor-pointer">
                    <option v-for="p in PRESETS" :key="p.key" :value="p.key">{{ p.label }}</option>
                </select>
                <button class="btn" @click="validateNow">Validate</button>
                <button class="btn ghost" @click="reset">Reset</button>
            </div>
        </div>

        <div class="lv-body px-4 pb-4">
            <!-- Left: form -->
            <section class="left">
                <div class="form">
                    <div v-for="f in activePreset.fields" :key="f.name" class="row">
                        <label class="label">{{ f.label }}</label>
                        <input v-if="f.type !== 'textarea'" :type="f.type" v-model="model[f.name]" class="input"
                            :placeholder="f.placeholder || ''" />
                        <textarea v-else v-model="model[f.name]" rows="3" class="input"
                            :placeholder="f.placeholder || ''" />
                        <div v-if="errors[f.name]?.length" class="err">
                            <div v-for="(e, i) in errors[f.name]" :key="i" class="err-item">• {{ e }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Right: rules + output -->
            <section class="right">
                <div class="box">
                    <div class="box-title">Laravel Validator rules (<span class="muted mark">FormRequest</span>)</div>
                    <pre class="code">{{ prettyRules }}</pre>
                </div>
                <div class="box">
                    <div class="box-title">Validator output</div>
                    <pre class="code">{{ lastResult }}</pre>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

type Field = {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'number' | 'textarea'
    placeholder?: string
    rules: string // e.g. "required|string|min:3|max:50"
}

type Preset = {
    key: string
    label: string
    fields: Field[]
}

const PRESETS: Preset[] = [
    {
        key: 'register',
        label: 'Register User',
        fields: [
            { name: 'name', label: 'Name', type: 'text', rules: 'required|string|min:3|max:50' },
            { name: 'email', label: 'Email', type: 'email', rules: 'required|email' },
            { name: 'password', label: 'Password', type: 'password', rules: 'required|string|min:6' },
            { name: 'password_confirmation', label: 'Confirm Password', type: 'password', rules: 'required|same:password' }
        ]
    },
    {
        key: 'invoice',
        label: 'Create Invoice',
        fields: [
            { name: 'org_id', label: 'Org ID', type: 'number', rules: 'required|integer|min:1' },
            { name: 'amount', label: 'Amount (MYR)', type: 'number', rules: 'required|numeric|min:1' },
            { name: 'currency', label: 'Currency', type: 'text', rules: 'required|in:MYR,USD,SGD' },
            { name: 'note', label: 'Note', type: 'textarea', rules: 'nullable|string|max:140' }
        ]
    },
    {
        key: 'contact',
        label: 'Contact Form',
        fields: [
            { name: 'subject', label: 'Subject', type: 'text', rules: 'required|string|min:3|max:80' },
            { name: 'email', label: 'Your Email', type: 'email', rules: 'required|email' },
            { name: 'message', label: 'Message', type: 'textarea', rules: 'required|string|min:10|max:400' }
        ]
    }
]

const presetKey = ref<Preset['key']>('register')
const activePreset = computed(() => PRESETS.find(p => p.key === presetKey.value)!)
const model = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string[]>>({})
const lastResult = ref<string>('(no run yet)')

watch(activePreset, () => {
    reset()
})

const prettyRules = computed(() => {
    const out: Record<string, string> = {}
    for (const f of activePreset.value.fields) out[f.name] = f.rules
    return JSON.stringify(out, null, 2)
})

const reset = () => {
    for (const f of activePreset.value.fields) {
        model[f.name] = ''
        errors[f.name] = []
    }
    lastResult.value = '(no run yet)'
}

/** Mini Laravel-like validator that supports the common rules we’re showing */
const validateNow = () => {
    // clear
    for (const k of Object.keys(errors)) errors[k] = []

    let ok = true

    for (const f of activePreset.value.fields) {
        const value = model[f.name]
        const rules = f.rules ? f.rules.split('|') : []

        for (const rule of rules) {
            const [name, arg] = rule.split(':')
            const add = (msg: string) => {
                errors[f.name] ||= []
                if (!errors[f.name]) {
                    errors[f.name] = []
                }
                errors[f.name]!.push(msg)
                ok = false
            }

            if (name === 'required') {
                if (value === undefined || value === null || String(value).trim() === '') add('The field is required.')
            }
            if (name === 'nullable') {
                // ignore if empty
                if (value === undefined || value === null || String(value).trim() === '') break
            }
            if (name === 'string') {
                if (value !== undefined && value !== null && typeof value !== 'string') add('Must be a string.')
            }
            if (name === 'email') {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!re.test(String(value || ''))) add('Must be a valid email address.')
            }
            if (name === 'integer') {
                if (!/^-?\d+$/.test(String(value || ''))) add('Must be an integer.')
            }
            if (name === 'numeric') {
                if (isNaN(Number(value))) add('Must be numeric.')
            }
            if (name === 'min') {
                const n = Number(arg)
                if (typeof value === 'number') {
                    if (value < n) add(`Must be at least ${n}.`)
                } else if (String(value || '').length < n) {
                    add(`Must be at least ${n} characters.`)
                }
            }
            if (name === 'max') {
                const n = Number(arg)
                if (typeof value === 'number') {
                    if (value > n) add(`May not be greater than ${n}.`)
                } else if (String(value || '').length > n) {
                    add(`May not be greater than ${n} characters.`)
                }
            }
            if (name === 'in') {
                const opts = (arg || '').split(',')
                if (!opts.includes(String(value))) add(`Must be one of: ${opts.join(', ')}.`)
            }
            if (name === 'same') {
                const other = model[arg || '']
                if (String(value) !== String(other ?? '')) add(`Must match ${arg}.`)
            }
        }
    }

    lastResult.value = ok
        ? '✅ Passed (no validation errors)'
        : '❌ Failed — see field errors.'
}
</script>

<style scoped>
.lv {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.lv-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.lv-title {
    color: #fff;
    font-weight: 800;
    letter-spacing: .2px;
}

.lv-title .muted {
    color: #a3a3a3;
}

.lv-actions {
    display: flex;
    gap: 8px;
}

.select {
    background: #0e0f10;
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 8px;
    padding: 8px;
    font-size: 13px;
}

.btn {
    border: 1px solid #10b98166;
    background: linear-gradient(145deg, #10b98122, #10b98111);
    color: #d1fae5;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.15s ease;
}

/* Hover: brighter emerald glow + lift */
.btn:hover {
    background: linear-gradient(145deg, #10b98133, #10b98122);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.25);
    transform: translateY(-1px);
}

/* Active click: subtle press-down */
.btn:active {
    transform: translateY(0);
    box-shadow: 0 0 4px rgba(16, 185, 129, 0.15);
}

/* Ghost variant: softer, grayish but still animated */
.btn.ghost {
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
}

.btn.ghost:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

.btn:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 0 12px 2px rgba(16, 185, 129, 0.2);
    opacity: 0;
    animation: btnPulse 1.4s ease-out infinite;
}

@keyframes btnPulse {
    0% {
        opacity: 0.2;
        transform: scale(1);
    }

    70% {
        opacity: 0;
        transform: scale(1.4);
    }

    100% {
        opacity: 0;
        transform: scale(1.4);
    }
}

.lv-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    min-height: 0;
}

@media (max-width: 960px) {
    .lv-body {
        grid-template-columns: 1fr;
    }
}

.left,
.right {
    border: 1px solid rgba(255, 255, 255, .08);
    background: #141414;
    border-radius: 10px;
    padding: 10px;
    min-height: 0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.label {
    color: #cbd5e1;
    font-size: 12px;
}

.input {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, .14);
    background: #0e0f10;
    color: #e5e7eb;
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 13px;
}

.err {
    color: #fecaca;
    font-size: 12.5px;
}

.err-item {
    margin-top: 2px;
}

.box {
    border: 1px solid rgba(255, 255, 255, .08);
    background: #0b0b0b;
    border-radius: 8px;
    overflow: hidden;
}

.box+.box {
    margin-top: 10px;
}

.box-title {
    padding: 8px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
    color: #e5e7eb;
    font-weight: 600;
}

.code {
    margin: 0;
    padding: 10px;
    color: #d1d5db;
    font-size: 12.5px;
    line-height: 1.55;
    white-space: pre-wrap;
    max-height: 220px;
    overflow: auto;
}
</style>