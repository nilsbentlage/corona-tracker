<script>
  import Menu from "./Menu.svelte";
  let src = "img/location-svgrepo-com.svg";

  let showMenu = false;

  function toggleMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    showMenu = !showMenu;
    document.getElementById("fab").classList.toggle("active");
  }
</script>

<div id="fab" class={showMenu === true ? "active" : ""} on:click={toggleMenu}>
  <img {src} alt="burger Icon" width="26px" height="26px" />
</div>
<div id="overlay" class="center-all {showMenu === true ? 'active' : ''}">
  <Menu />
  <div class="close-button" on:click={toggleMenu}>CLOSE</div>
</div>

<style>
  #fab {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
    border-radius: 4rem;
    background: #008bcc;
    display: grid;
    align-items: center;
    justify-content: center;
    transition: all ease-in-out 0.5s;
    z-index: 4;
    margin: 0;
    padding: 0;
  }
  .center-all {
    display: grid;
    align-items: center;
    text-align: center;
    height: 100vh;
  }
  #overlay {
    background-color: rgba(0, 0, 0, 0.95);
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transform: translateX(100vw);
    transition: all ease-in-out 0.5s;
    z-index: 3;
    margin: 0;
    padding: 0;
  }
  #overlay.active {
    transform: translateX(0);
  }
  #fab.active {
    transform: translateX(100px);
  }
  .close-button {
    background: #008bcc;
    padding: 4px 64px;
    line-height: 3rem;
    margin: auto;
    text-align: center;
    color: white;
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    height: 3rem;
    border-radius: 3rem;
    transform: translateX(-50%);
  }
</style>
