<script>
  import Menu from "./Menu.svelte";
  let src = "img/location-svgrepo-com.svg";
  export let data;
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
  <Menu {data} />
  <div class="close-button" on:click={toggleMenu}>CLOSE</div>
</div>

<style>
  :root {
    --button-size: 48px;
    --half-button-size: calc(var(--button-size) / 2);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  @keyframes slideIn {
    from {
      transform: translate(-50%, calc(var(--button-size) * 3));
    }
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(-50%);
    }
    25% {
      transform: translateX(-50%) scale(1.3);
    }
    50% {
      transform: translateX(-50%) scale(1);
    }
    to {
      transform: scale(1) translate(-50%, calc(var(--button-size) * 3));
    }
  }
  #fab {
    position: fixed;
    bottom: var(--half-button-size);
    left: 50%;
    transform: translate(-50%, 0%);
    width: var(--button-size);
    height: var(--button-size);
    border-radius: 4rem;
    background: #008bcc;
    display: grid;
    align-items: center;
    justify-content: center;
    /* transition: all ease-in-out 0.5s; */
    animation: slideIn 0.3s ease-in-out forwards;
    z-index: 4;
    margin: 0;
    padding: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
  #fab > img {
    transform: scale(1.1);
  }
  #fab.active {
    /* transform: translate(-50%, calc(var(--button-size) * 3)); */
    animation: slideOut 0.3s ease-in-out forwards;
  }
  .center-all {
    display: grid;
    align-items: center;
    text-align: center;
    height: 100vh;
  }
  #overlay {
    background-color: rgba(0, 0, 0, 0.9);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transform: translateY(100vh);
    transition: all ease-in-out 0.3s;
    opacity: 0;
    z-index: 3;
    margin: 0;
    padding: 0;
  }
  #overlay.active {
    transform: translateY(0);
    opacity: 1;
  }

  .close-button {
    background: #008bcc;
    padding: 6px 24px;
    line-height: var(--half-button-size);
    margin: auto;
    cursor: pointer;
    text-align: center;
    color: white;
    position: absolute;
    bottom: var(--button-size);
    left: 50%;
    height: var(--half-button-size);
    border-radius: var(--button-size);
    transform: translate(-50%, 50%);
  }
</style>
