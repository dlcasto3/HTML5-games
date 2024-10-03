function updateNavAndFooter() {
    const navm = document.getElementById("navm");
    navm.classList.add("m");
    navm.innerHTML = `
        <button class="navbtn" onclick="window.location.href='/';"><i class="wicon wicon-home"></i><br><span class="navtext">Home</span></button>
        <div class="right">
            <button class="navbtn" onclick="window.location.href='/chat/';"><i class="wicon wicon-chat"></i><br><span class="navtext">Chat</span></button>
            <button class="navbtn" onclick="window.location.href='/axis/';"><i class="wicon wicon-axis"></i><br><span class="navtext">Axis</span></button>
            <button class="navbtn" onclick="window.location.href='/games/';"><i class="wicon wicon-gamepad-handles"></i><br><span class="navtext">Games</span></button>
            <button class="navbtn" onclick="window.location.href='/tools/';"><i class="wicon wicon-tools"></i><br><span class="navtext">Tools</span></button>
            <button class="navbtn" onclick="window.location.href='/settings/';"><i class="wicon wicon-gear"></i><br><span class="navtext">Settings</span></button>
        </div>
    `;
    const navs = document.getElementById("sidenav");
    navs.innerHTML = `
        <div style="height: 55px; width: 100%;"></div> <!-- spacer -->
        <button onclick="window.location.href='/';"><i class="wicon wicon-home"></i><span>Home</span></button>
        <button onclick="window.location.href='/chat/';"><i class="wicon wicon-chat"></i><span>Chat</span></button>
        <button onclick="window.location.href='/axis/';"><i class="wicon wicon-axis"></i><span>Axis</span></button>
        <button onclick="window.location.href='/games/';"><i class="wicon wicon-gamepad-handles"></i><span>Games</span></button>
        <button onclick="window.location.href='/tools/';"><i class="wicon wicon-tools"></i><span>Tools</span></button>
        <button onclick="window.location.href='/settings/';"><i class="wicon wicon-gear"></i><span>Settings</span></button>
    `;
            
    const footer = document.getElementById("footer");
    footer.innerHTML += `
        <div class="top">
            <h5>Made with <span class="wicon wicon-coffee"></span> by wraithcode <i class="wicon wicon-copyright"></i> <span id="footerYear">****</span></h5>
            <div class="spacer"></div>
            <h5 id="status">Status: <span>LOADING</span></h5>
        </div>
        <div class="bottom">
            <div class="leftwrapper">
                <div class="section">
                    <p>Personal links</p>
                    <a href="https://github.com/wraithcode2018"><i class="wicon wicon-github"></i>&nbsp;Github</a>
                    <a href="https://app.revolt.chat"><span class="wicon wicon-revoltchat"></span>&nbsp; Revolt</a>
                    <a href="https://www.reddit.com/user/wraithcode18/"><i class="wicon wicon-reddit"></i>&nbsp;Reddit</a>
                    <a href="https://youtube.com/@wraithcoding"><i class="wicon wicon-youtube"></i>&nbsp;Youtube</a>
                    <a href="https://open.spotify.com/user/31ssxskpd7xxb24mhzvbwlwgnv6u"><i class="wicon wicon-spotify"></i>&nbsp;Spotify</a>
                    <a href="https://wraithcode.straw.page"><i class="wicon wicon-strawpage"></i>&nbsp;Straw.page</a>
                </div>
                <div class="section">
                    <p>Navigation</p>
                    <a href="https://forms.gle/AVzecxUqzPSVxCGa9"><i class="wicon wicon-gamepad-handles"></i>&nbsp;Game Request Form</a>
                </div>
            </div>
            <div class="rightwrapper">
                <div class="section exc">
                    <p>Community</p>
                    <a href="mailto:kai.pollack@dcinternationalschool.org"><i class="wicon wicon-email"></i>&nbsp;Email</a>
                    <a href="https://www.reddit.com/r/wraithcode/"><i class="wicon wicon-reddit"></i>&nbsp;Join the wraiths</a>
                    <div class="spacer"></div>
                </div>
                <div class="spacer"></div>
                <a href="https://buymeacoffee.com/wraithcode"><i class="wicon wicon-buymeacoffee"></i>&nbsp;Buy me a coffee (WIP)</a>
            </div>
        </div>
    `;
}
document.addEventListener("DOMContentLoaded", updateNavAndFooter)
