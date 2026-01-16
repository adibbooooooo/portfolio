<template>
    <Transition
        appear
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-x-[24px]"
        enter-to-class="opacity-100 translate-x-0"
    >
        <slot />
    </Transition>
</template>