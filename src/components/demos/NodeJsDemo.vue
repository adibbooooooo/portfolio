<template>
    <div class="my-4">
        <div class="cli-wrap">
            <!-- Helper toolbar (like your earlier demos) -->
            <div class="toolbar">
                <button class="btn" @click="inject('node -v')">node -v</button>
                <button class="btn" @click="inject('npm -v')">npm -v</button>
                <button class="btn" @click="inject('npm init -y')">npm init -y</button>
                <button class="btn" @click="inject('npm i express')">npm i express</button>
                <button class="btn" @click="inject('node server.js')">node server.js</button>
                <button class="btn" @click="inject('me')">me</button>
                <button class="btn ghost" @click="clearAll">clear</button>
            </div>
    
            <!-- Terminal -->
            <div class="terminal h-[350px]" ref="termRef">
                <div class="lines" ref="linesRef">
                    <!-- Welcome / hint -->
                    <div class="hint"># Node.js CLI Playground — try commands or use the buttons above</div>
    
                    <div v-for="(item, i) in history" :key="i" class="block">
                        <div class="prompt">
                            <span class="user">adib</span>@<span class="host">dev</span>:
                            <span class="path">~/projects/demo</span>$ {{ item.cmd }}
                        </div>
    
                        <pre v-if="item.out" class="out" v-html="item.out"></pre>
                        <pre v-if="item.err" class="err">{{ item.err }}</pre>
                    </div>
    
                    <!-- Live prompt -->
                    <div class="prompt-row">
                        <span class="prompt"><span class="user">adib</span>@<span class="host">dev</span>:<span
                                class="path">~/projects/demo</span>$</span>
                        <input ref="inputRef" v-model="current" class="in no-focus" spellcheck="false" autocomplete="off"
                            autocapitalize="off" @keydown.enter.prevent="run" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, nextTick, computed } from 'vue'

type Entry = { cmd: string; out?: string; err?: string }

const termRef = ref<HTMLDivElement | null>(null)
const linesRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const history = reactive<Entry[]>([])
const current = ref('')
const lockedMax = ref<number | null>(null)

/** Lock terminal max-height to its first rendered height (your earlier request) */
onMounted(async () => {
    await nextTick()
    if (termRef.value) {
        lockedMax.value = termRef.value.clientHeight
    }
    inputRef.value?.focus()
})

function inject(cmd: string) {
    current.value = cmd
    inputRef.value?.focus()
}

function clearAll() {
    history.splice(0, history.length)
    inputRef.value?.focus()
}

function push(cmd: string, out?: string, err?: string) {
    history.push({ cmd, out, err })
    nextTick(() => {
        linesRef.value?.scrollTo({ top: linesRef.value.scrollHeight })
    })
}

/** ANSI-safe helper: wrap plain text in <span> or <pre> already; we keep it simple */
function esc(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
}

/** Adib Omar ASCII banner (from your sample) */
const ASCII_ME = `
<code class="ascii">                    ,,    ,,  ,,                
      db          \`7MM    db *MM                
     ;MM:           MM        MM                
    ,V^MM.     ,M""bMM  \`7MM  MM,dMMb.          
   ,M  \`MM   ,AP    MM    MM  MM    \`Mb         
   AbmmmqMA  8MI    MM    MM  MM     M8         
  A'     VML \`Mb    MM    MM  MM.   ,M9         
.AMA.   .AMMA.\`Wbmd"MML..JMML.P^YbmdP'          
                                        
  .g8""8q.                                      
.dP'    \`YM.                                    
dM'      \`MM \`7MMpMMMb.pMMMb.   ,6"Yb.  \`7Mb,od8
MM        MM   MM    MM    MM  8)   MM    MM' "'
MM.      ,MP   MM    MM    MM   ,pm9MM    MM    
\`Mb.    ,dP'   MM    MM    MM  8M   MM    MM    
  \`"bmmd"'   .JMML  JMML  JMML.\`Moo9^Yo..JMML.  </code>`.trim()

/** Fake FS + env (very small, just enough to feel real) */
const fake = {
    nodev: 'v20.11.1',
    npmv: '10.5.0',
    pwd: '/home/adib/projects/demo',
    files: ['package.json', 'server.js', 'README.md'],
}

function run() {
    const raw = (current.value || '').trim()
    if (!raw) { return }

    const [cmd, ...args] = raw.split(/\s+/)
    let out = '', err = ''

    switch (cmd) {
        case 'help':
            out =
                [
                    'Available:',
                    '  node -v              Show Node.js version',
                    '  npm -v               Show npm version',
                    '  npm init -y          Create package.json (simulated)',
                    '  npm i <pkg>          Install package (simulated)',
                    '  node server.js       Run simple HTTP server (simulated)',
                    '  ls                   List files',
                    '  pwd                  Print working directory',
                    '  echo <text>          Print text',
                    '  clear                Clear screen',
                    '  me                   Print ASCII banner',
                ].join('\n')
            break

        case 'clear':
            clearAll()
            current.value = ''
            return

        case 'node':
            if (args[0] === '-v' || args[0] === '--version') {
                out = fake.nodev
            } else if (args[0] === 'server.js') {
                out = [
                    'Server listening on http://localhost:3000',
                    'GET / 200  - Hello from Node.js (simulated)',
                ].join('\n')
            } else {
                err = `node: cannot execute ${args.join(' ')} (simulated)`
            }
            break

        case 'npm':
            if (args[0] === '-v' || args[0] === '--version') {
                out = fake.npmv
            } else if (args[0] === 'init' && args[1] === '-y') {
                out = 'Wrote to package.json (simulated)'
                if (!fake.files.includes('package.json')) fake.files.unshift('package.json')
            } else if (args[0] === 'i' || args[0] === 'install') {
                const pkg = args[1] || 'express'
                out = `added ${pkg}@latest (simulated)`
            } else {
                err = `npm: unknown args ${args.join(' ')}`
            }
            break

        case 'ls':
            out = fake.files.join('\n')
            break

        case 'pwd':
            out = fake.pwd
            break

        case 'echo':
            out = args.join(' ')
            break

        case 'me':
            out = ASCII_ME
            break

        default:
            err = `${cmd}: command not found`
    }

    push(raw, out ? escOrHtml(out) : undefined, err || undefined)
    current.value = ''
    inputRef.value?.focus()
}

/** Allow our ASCII banner (already HTML) while escaping normal output */
function escOrHtml(s: string) {
    return s.includes('<code class="ascii">') ? s : esc(s)
}
</script>

<style scoped>
.cli-wrap {
    background: #0b0c0d;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 12px;
    padding: 10px;
    max-width: 680px;
    margin: 0 auto;
}

/* Toolbar (kept consistent with your other demos) */
.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 12px;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all .2s ease;
}

.btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, .2);
    transform: translateY(-1px);
}

.btn:active {
    transform: scale(.96);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, .1);
}

.btn.ghost:hover {
    color: #d1fae5;
    border-color: rgba(16, 185, 129, .4);
}

.terminal {
    background: #0e0f10;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    overflow: hidden;
    /* grows naturally first */
}

.lines {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #e5e7eb;
    padding: 10px 12px;
    max-height: 350px;
    /* visual guard; real cap is locked in JS via maxHeight */
    overflow: auto;
}

.hint {
    color: #94a3b8;
    margin-bottom: 6px;
}

.prompt-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
}

.prompt {
    color: #9cdcfe;
}

.prompt .user {
    color: #22c55e;
    font-weight: 700;
}

.prompt .host {
    color: #60a5fa;
}

.prompt .path {
    color: #a3a3a3;
}

.in {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    /* no focus ring */
    color: #e5e7eb;
    caret-color: #22c55e;
    font: inherit;
    border-radius: unset!important;
}

.in:focus {
    outline: none;
}

.out {
    margin: 4px 0 6px;
    color: #e5e7eb;
    white-space: pre-wrap;
}

.err {
    margin: 4px 0 6px;
    color: #ef4444;
    white-space: pre-wrap;
}

/* Render ASCII banner a bit larger without breaking flow */
.ascii {
    display: block;
    white-space: pre;
    color: #a7f3d0;
    text-shadow: 0 0 6px rgba(16, 185, 129, .35);
    line-height: 1.05;
    font-size: 12px;
}

.note {
    margin-top: 8px;
    color: #94a3b8;
    font-size: 12.5px;
}
</style>