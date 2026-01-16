<template>
    <div class="p-4 md:p-6 text-white/90 space-y-5">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <div class="text-xl font-bold text-white normal-font">
                    MySQL <span class="text-[#a3a3a3]">Query Visualizer</span>
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <button class="btn" @click="resetAll">Reset</button>
                <button class="btn ghost" @click="randomize">Randomize Data</button>
            </div>
        </header>

        <!-- Builder -->
        <div class="grid gap-4 md:grid-cols-3">
            <!-- SELECT -->
            <div class="panel">
                <div class="panel-title">SELECT</div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="c in allColumns" :key="c.key" class="pill"
                        :class="{ active: selectedCols.has(c.key) }" @click="toggleCol(c.key)">
                        {{ c.label }}
                    </button>
                </div>
            </div>

            <!-- WHERE -->
            <div class="panel">
                <div class="panel-title">WHERE</div>
                <div class="grid gap-2">
                    <div class="row">
                        <label class="lab">role</label>
                        <select v-model="whereRole" class="in">
                            <option value="">(any)</option>
                            <option value="admin">admin</option>
                            <option value="editor">editor</option>
                            <option value="user">user</option>
                        </select>
                    </div>
                    <div class="row">
                        <label class="lab">min_total_spend</label>
                        <input type="number" min="0" step="10" class="in" v-model.number="minSpend" />
                    </div>
                    <div class="row">
                        <label class="lab">JOIN orders</label>
                        <label class="switch">
                            <input type="checkbox" v-model="withJoin" />
                            <span class="trk"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- ORDER / LIMIT -->
            <div class="panel">
                <div class="panel-title">ORDER / LIMIT</div>
                <div class="grid gap-2">
                    <div class="row">
                        <label class="lab">order_by</label>
                        <select class="in" v-model="orderBy">
                            <option value="">(none)</option>
                            <option value="name">name</option>
                            <option value="total_spend">total_spend</option>
                            <option value="orders">orders</option>
                            <option value="created_at">created_at</option>
                        </select>
                    </div>
                    <div class="row">
                        <label class="lab">direction</label>
                        <div class="flex gap-2">
                            <button class="btn ghost" :class="{ on: orderDir === 'ASC' }"
                                @click="orderDir = 'ASC'">ASC</button>
                            <button class="btn ghost" :class="{ on: orderDir === 'DESC' }"
                                @click="orderDir = 'DESC'">DESC</button>
                        </div>
                    </div>
                    <div class="row">
                        <label class="lab">limit</label>
                        <input type="number" min="1" step="1" class="in" v-model.number="limitN" />
                    </div>
                </div>
            </div>
        </div>

        <!-- SQL preview -->
        <div class="sql-box">
            <div class="text-[12.5px] text-white/70 mb-1">SQL</div>
            <pre class="sql">{{ sqlPreview }}</pre>
        </div>

        <!-- Results -->
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th v-for="col in visibleHeaders" :key="col">{{ col }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="rows.length === 0">
                        <td :colspan="visibleHeaders.length" class="empty">
                            No results
                        </td>
                    </tr>
                    <tr v-for="r in rows" :key="r.id">
                        <td v-for="col in visibleHeaders" :key="col">
                            <span v-if="col === 'created_at'">{{ fmtDate(r[col]) }}</span>
                            <span v-else-if="col === 'total_spend'">RM {{ r[col].toFixed(2) }}</span>
                            <span v-else>{{ r[col] }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

/** ---------------------------------------
 *  Tiny demo schema (users, orders)
 *  --------------------------------------*/
type User = {
    id: number
    name: string
    role: 'admin' | 'editor' | 'user'
    created_at: string
}
type Order = {
    id: number
    user_id: number
    amount: number
    created_at: string
}

const seedUsers: User[] = [
    { id: 1, name: 'Adib Omar', role: 'admin', created_at: '1999-04-06' },
    { id: 2, name: 'Hanis Cool', role: 'editor', created_at: '1999-09-15' },
    { id: 3, name: 'Afiq', role: 'user', created_at: '2024-11-20' },
    { id: 4, name: 'Nor Naziah', role: 'user', created_at: '2025-03-18' },
    { id: 5, name: 'Omar Yusof', role: 'editor', created_at: '2025-04-02' },
]

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }

function makeOrders(): Order[] {
    const arr: Order[] = []
    let oid = 1
    for (const u of seedUsers) {
        const n = rand(0, 6)
        for (let i = 0; i < n; i++) {
            arr.push({
                id: oid++,
                user_id: u.id,
                amount: rand(10, 300),
                created_at: `2025-0${rand(1, 6)}-${String(rand(1, 28)).padStart(2, '0')}`
            })
        }
    }
    return arr
}

const db = reactive({
    users: structuredClone(seedUsers) as User[],
    orders: makeOrders() as Order[],
})

function randomize() {
    db.orders = makeOrders()
}

/** ---------------------------------------
 *  Query builder state
 *  --------------------------------------*/
const allColumns = [
    { key: 'id', label: 'id' },
    { key: 'name', label: 'name' },
    { key: 'role', label: 'role' },
    { key: 'created_at', label: 'created_at' },
    // join-projected:
    { key: 'orders', label: 'orders (JOIN)' },
    { key: 'total_spend', label: 'total_spend (JOIN)' },
] as const

const selectedCols = ref<Set<string>>(new Set(['id', 'name', 'role', 'orders', 'total_spend']))
const withJoin = ref(true)

const whereRole = ref<string>('')
const minSpend = ref<number>(0)

const orderBy = ref<string>('total_spend')
const orderDir = ref<'ASC' | 'DESC'>('DESC')
const limitN = ref<number>(5)

function toggleCol(key: string) {
    const s = new Set(selectedCols.value)
    s.has(key) ? s.delete(key) : s.add(key)
    selectedCols.value = s
}
function resetAll() {
    selectedCols.value = new Set(['id', 'name', 'role', 'orders', 'total_spend'])
    withJoin.value = true
    whereRole.value = ''
    minSpend.value = 0
    orderBy.value = 'total_spend'
    orderDir.value = 'DESC'
    limitN.value = 5
}

/** ---------------------------------------
 *  Projected rows (JOIN + filters + sort + limit)
 *  --------------------------------------*/
const projected = computed(() => {
    // JOIN projection
    const flat = db.users.map(u => {
        const os = db.orders.filter(o => o.user_id === u.id)
        const total = os.reduce((s, o) => s + o.amount, 0)
        return {
            ...u,
            orders: os.length,
            total_spend: total
        }
    })

    // WHERE (role)
    let rows = whereRole.value
        ? flat.filter(r => r.role === whereRole.value)
        : flat

    // WHERE (min spend) — only meaningful if JOIN ON
    if (withJoin.value && minSpend.value > 0) {
        rows = rows.filter(r => r.total_spend >= minSpend.value)
    }

    // ORDER
    if (orderBy.value) {
        const key = orderBy.value as keyof typeof rows[number]
        rows.sort((a: any, b: any) => {
            const va = a[key], vb = b[key]
            if (va === vb) return 0
            return orderDir.value === 'ASC' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
        })
    }

    // LIMIT
    if (limitN.value && limitN.value > 0) rows = rows.slice(0, limitN.value)

    return rows
})

const visibleHeaders = computed(() => {
    // If JOIN is off, hide join-project columns even if selected
    const keys = [...selectedCols.value].filter(k => withJoin.value ? true : (k !== 'orders' && k !== 'total_spend'))
    // Ensure at least one column
    return keys.length ? keys : ['id']
})

const rows = computed(() => {
    return projected.value.map(r => {
        const out: Record<string, any> = {}
        visibleHeaders.value.forEach(h => out[h] = (r as any)[h])
        return out
    })
})

/** ---------------------------------------
 *  SQL preview (string only)
 *  --------------------------------------*/
const sqlPreview = computed(() => {
    const cols = visibleHeaders.value.join(', ')
    let sql = `SELECT ${cols}\nFROM users`
    if (withJoin.value && (selectedCols.value.has('orders') || selectedCols.value.has('total_spend') || minSpend.value > 0 || orderBy.value === 'orders' || orderBy.value === 'total_spend')) {
        sql += `\nLEFT JOIN orders ON orders.user_id = users.id`
        sql += `\nGROUP BY users.id`
    }
    const wheres: string[] = []
    if (whereRole.value) wheres.push(`role = '${whereRole.value}'`)
    if (withJoin.value && minSpend.value > 0) wheres.push(`SUM(orders.amount) >= ${minSpend.value}`)
    if (wheres.length) sql += `\nWHERE ` + wheres.join(' AND ')
    if (orderBy.value) {
        const ob = orderBy.value
        const sel = (ob === 'orders') ? 'COUNT(orders.id)' : (ob === 'total_spend') ? 'SUM(orders.amount)' : `users.${ob}`
        sql += `\nORDER BY ${sel} ${orderDir.value}`
    }
    if (limitN.value && limitN.value > 0) sql += `\nLIMIT ${limitN.value};`
    else sql += `;`
    return sql
})

/** ---------------------------------------
 *  Utils
 *  --------------------------------------*/
function fmtDate(s: string) {
    // lightweight date display
    return s
}
</script>

<style scoped>
/* Panels */
.panel {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    padding: 12px;
}

.panel-title {
    color: #fff;
    font-weight: 700;
    margin-bottom: 8px;
}

.hint {
    margin-top: 10px;
    color: #9aa3ad;
    font-size: 12px;
}

/* Chips */
.pill {
    border: 1px solid rgba(255, 255, 255, .12);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 12.5px;
    border-radius: 999px;
    padding: 6px 10px;
    cursor: pointer;
    transition: .15s;
}

.pill:hover {
    border-color: rgba(16, 185, 129, .5);
    color: #a7f3d0;
}

.pill.active {
    border-color: rgba(16, 185, 129, .6);
    background: rgba(16, 185, 129, .10);
    color: #a7f3d0;
}

/* Form rows */
.row {
    display: grid;
    /* grid-template-columns: 80px 1fr; */
    align-items: center;
    gap: 8px;
}

@media (min-width: 768px) {
    .row {
        grid-template-columns: 130px 1fr;
        /* desktop and larger */
    }
}

.lab {
    color: #a7b0bb;
    font-size: 12.5px;
}

.in {
    background: #0e0f10;
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, .14);
    border-radius: 8px;
    font-size: 13px;
    padding: 7px 8px;
    cursor: pointer;
}

/* Switch */
.switch {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 24px;
    cursor: pointer;
}

.switch input {
    display: none;
}

.trk {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, .12);
    border-radius: 999px;
    transition: .2s;
}

.trk:before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #e5e7eb;
    top: 3px;
    left: 3px;
    transition: .2s;
}

.switch input:checked+.trk {
    background: rgba(16, 185, 129, .5);
}

.switch input:checked+.trk:before {
    transform: translateX(18px);
}

/* Buttons (match your other demos) */
.btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
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

.btn.ghost.on {
    border-color: rgba(16, 185, 129, .6);
    color: #a7f3d0;
}

/* SQL box */
.sql-box {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    padding: 12px 14px;
}

.sql {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 12.5px;
    color: #e5e7eb;
    white-space: pre-wrap;
}

/* Table */
.table-wrap {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    overflow: auto;
}

.tbl {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px 10px;
    font-size: 13px;
    text-align: left;
}

thead th {
    position: sticky;
    top: 0;
    background: #121212;
    color: #d2d6dc;
    border-bottom: 1px solid rgba(255, 255, 255, .08);
}

tbody td {
    border-top: 1px solid rgba(255, 255, 255, .06);
    color: #e5e7eb;
}

.empty {
    text-align: center;
    color: #9aa3ad;
    padding: 16px;
}
</style>