/*-======= Style Switcheer ======*/
const styleSwitcherToggel = document.querySelector(".style-switcher-toggel");
styleSwitcherToggel.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})
/*====== Switcheer on scroll =====*/
window.addEventListener("scroll",() => {
    if(document.querySelector(".style-switcher").classList.contains("open"))
    {
        document.querySelector(".style-switcher").classList.remove("open");
    }
})

/*=====Theme Color=====*/
const alternaterStyle = document.querySelectorAll(".alternate-style"); 
function setActiveStyle(color)
{
    alternaterStyle.forEach((style) => {
        if(color===style.getAttribute("title"))
        {
            style.removeAttribute("disabled");
        }
        else
        {
            style.setAttribute("disabled" ,"true");
        }
    })
}

/*======== theme light abd dark ========*/
const dayNight = document.querySelector(".day-night");
dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-sun");  
    dayNight.querySelector("i").classList.toggle("fa-moon"); 
    document.body.classList.toggle("dark");
})
window.addEventListener("load" , () => {
    if(document.body.classList.contains("dark"))
    {
        dayNight.querySelector("i").classList.add("fa-sun");        
    }
    else
    {
        dayNight.querySelector("i").classList.add("fa-moon");   
    }
})

/*======== Typing Animation ========*/

