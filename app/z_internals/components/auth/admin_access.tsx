import React from "react";

// shows login need UI if not logged in at all
// shows admin access need UI if logged in but not admin
export default function AdminAccessComponent(
    {
        message : string = "You must be an administrator to access this section of TownSpark."
        onLoginClick = () => {}, // default to redirect to login page can be overridden
        onLogoutClick = () => {}, // default to perform logout action can be overridden
    }
) {
    return <>

<div class="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display group/design-root overflow-x-hidden">
<div class="flex min-h-screen w-full grow flex-col items-center justify-center p-4">
<div class="flex w-full max-w-md flex-col items-center justify-center text-center">
<!-- Icon -->
<div class="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-primary/20">
<span class="material-symbols-outlined text-primary" style="font-size: 48px;">
                        admin_panel_settings
                    </span>
</div>
<!-- HeadlineText -->
<h1 class="text-slate-900 dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-2">Admin Access Required</h1>
<!-- BodyText -->
<p class="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-sm">You must be an administrator to access this section of TownSpark.</p>
<!-- Spacer -->
<div class="h-8"></div>
<!-- ButtonGroup -->
<div class="w-full">
<div class="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full">
<span class="truncate">Go to Dashboard</span>
</button>
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full">
<span class="truncate">Log Out</span>
</button>
</div>
</div>
</div>
</div>
</div>

    
    
    </>
}
