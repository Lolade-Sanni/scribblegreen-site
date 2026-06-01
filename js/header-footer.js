// Insert Header
document.getElementById("navbar").innerHTML = `
    <div class="navbar__inner">
        <a href="index.html" class="navbar__logo">
            <span class="navbar__logo-icon"><img class="logo-icon" src="images/scribblegreen-logo.png"></span>
        </a>
        <ul class="navbar__nav">
            <li><a href="about.html">About</a></li>
            <li class="nav-dropdown">
                <span class="nav-dropdown__label">Services <span class="material-icons-round">expand_more</span></span>
                <div class="nav-dropdown__menu">
                    <a href="services.html">All Services</a>
                    <a href="services-consultancy.html">Consultancy</a>
                    <a href="services-research.html">Research &amp; Writing</a>
                    <a href="services-ai.html">AI &amp; Digital Innovation</a>
                </div>
            </li>
            <li><a href="courses.html">Courses</a></li>
            <li><a href="events-and-insights.html">Events & Insights</a></li>
            <li class="nav-dropdown">
                <span class="nav-dropdown__label">Career <span class="material-icons-round">expand_more</span></span>
                <div class="nav-dropdown__menu">
                    <a href="ambassador.html">Student Ambassador</a>
                    <a href="join-team.html">Join Our Team</a>

                </div>
            </li>
            <li><a href="contact.html">Contact Us</a></li>
        </ul>
        <div class="navbar__cta">
            <!--            <a href="cv-builder.html" class="btn btn-outline">CV Builder</a>-->
        </div>
        <div class="navbar__hamburger"><span></span><span></span><span></span></div>
    </div>
`;


document.getElementById("mobileNav").innerHTML = `
    <span class="mob-label">Scribblegreen</span>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <span class="mob-label">Services</span>
    <a href="services.html">All Services</a>
    <a href="services-consultancy.html">Consultancy</a>
    <a href="services-research.html">Research &amp; Writing</a>
    <a href="services-ai.html">AI &amp; Digital Innovation</a>
    <span class="mob-label">Learn</span>
    <a href="courses.html">Courses</a>
    <a href="events-insights.html">Events &amp; Insights</a>
    <span class="mob-label">Career</span>
    <a href="ambassador.html">Ambassador Programme</a>
    <a href="join-team.html">Join the Team</a>
    <span class="mob-label">Contact Us</span>
    <a href="contact.html">Contact</a>
`;

// Insert Footer
document.getElementById("footer-placeholder").innerHTML = `
    <!-- PASTE FOOTER HTML HERE -->
`;