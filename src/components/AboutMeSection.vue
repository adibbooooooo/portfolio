<template>
    <p class="text-[12px] text-[#8F8F8F] mb-2">
        {{ "<!-- About me -->" }}
    </p>

    <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8">
        <!-- Left copy -->
        <div>
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl">
                The Way I Build
            </h2>

            <p class="mt-6 text-[14px] leading-7 text-primary">
                I’m a versatile software engineer driven by curiosity and
                <span class="mark" style="--d:0s">creativity</span>.
                My work focuses on building
                <span class="mark" style="--d:.12s">reliable</span>,
                <span class="mark" style="--d:.24s">meaningful</span>, and
                <span class="mark" style="--d:.36s">user-centered products</span>
                that blend solid engineering with thoughtful design.
                I enjoy finding balance between logic and aesthetics by writing clean, efficient code
                while shaping smooth and intuitive user experiences.
            </p>

            <p class="mt-5 text-[14px] leading-7 text-primary">
                I take pride in
                <span class="mark" style="--d:.48s">turning ideas into practical solutions</span>
                through
                <span class="mark" style="--d:.6s">clarity</span>,
                <span class="mark" style="--d:.72s">collaboration</span>, and
                <span class="mark" style="--d:.84s">purpose</span>.
                Whether developing web platforms, mobile apps, or blockchain-integrated systems,
                I aim to deliver results that feel
                <span class="mark" style="--d:.96s">simple</span>,
                <span class="mark" style="--d:1.08s">scalable</span>, and
                <span class="mark" style="--d:1.2s">crafted with care</span>.
            </p>
        </div>

        <!-- Right portrait card -->
        <aside class="h-full flex items-center">
            <div class="rounded-[8px] border border-seperator bg-[#1b1b1b] overflow-hidden w-[320px]">
                <img 
                    src="/about-picture.jpeg" 
                    alt="Portrait" 
                    class="w-full h-[340px] object-cover object-top"
                    draggable="false" 
                />
                <div
                    class="flex items-center justify-between border-t border-seperator px-4 py-3 text-[13px] text-primary"
                >
                    <span>Contact me:</span>
                    <div class="flex items-center gap-4 text-white/80">
                        <!-- 📞 Phone -->
                        <a href="tel:+601161770407" aria-label="Call Adib" class="hover:text-emerald-400 transition">
                            <i class="pi pi-phone text-[15px]"></i>
                        </a>

                        <!-- 💬 WhatsApp -->
                        <a href="https://wa.me/601161770407?text=Hi%20Adib!%20I%20came%20from%20your%20portfolio%20site%20and%20would%20like%20to%20connect."
                            target="_blank" rel="noopener" aria-label="WhatsApp"
                            class="hover:text-emerald-400 transition">
                            <i class="pi pi-whatsapp text-[15px]"></i>
                        </a>

                        <!-- ✉️ Email -->
                        <a href="mailto:work@adibomar.com?subject=Let's%20Work%20Together&body=Hi%20Adib,%0D%0A%0D%0AI%20found%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project%20or%20collaboration.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]"
                            aria-label="Email Adib" class="hover:text-emerald-400 transition">
                            <i class="pi pi-envelope text-[15px]"></i>
                        </a>

                        <!-- LinkedIn -->
                        <a href="https://www.linkedin.com/in/adibomar/" target="_blank" rel="noopener noreferrer"
                            aria-label="LinkedIn" class="hover:text-emerald-400 transition">
                            <i class="pi pi-linkedin text-[15px]"></i>
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>