<script>
  import Fab from "./Fab.svelte";

  let districts = JSON.parse(localStorage.getItem("districts"));
  if (!districts) {
    districts = ["05711", "05754", "03459", "03404"];
  }

  async function countryIncidence() {
    return fetch("https://api.corona-zahlen.org/germany")
      .then((response) => response.json().then((data) => data))
      .catch((err) => {
        console.log("API call -germany- failed :" + err);
      });
  }

  async function districtIncidence() {
    return fetch("https://api.corona-zahlen.org/districts")
      .then((response) => response.json())
      .catch((err) => {
        console.log("API call -districts- failed :" + err);
      });
  }

  let bothPromises = Promise.all([
    countryIncidence(),
    districtIncidence(),
  ]).catch((err) => {
    console.log(err);
    errorMessage();
  });

  function startTimer(duration, display) {
    let i = duration;
    let timer = setInterval(function () {
      display.textContent = i;
      if (i > 0) {
        i--;
      } else {
        clearInterval(timer);
        location.reload();
      }
    }, 1000);
  }

  function errorMessage() {
    let timeInSeconds = 40,
      display = document.querySelector("#time");
    startTimer(timeInSeconds, display);
  }
</script>

<main>
  <div class="bg-image" />
  <h1><small>Casumer</small><br />Corona Tracker</h1>
  {#await bothPromises}
    <div class="loading">
      <div>
        <h2>Loading</h2>
        Maybe you have called the API too often!?<br />
        You have to wait 40 seconds ...
        <span id="time">40</span>
      </div>
    </div>
  {:then data}
    <Fab {data} />
    <div class="outputContainer fade-in">
      <h3>Deutschland</h3>
      <div class="ger--parent">
        <div class="ger--child">
          <span class="title">Inzidenz:</span>
          <span class="title">Fälle gesamt:</span>
          <span class="title">Tote:</span>
        </div>
        <div class="ger--child">
          <span class="value">{data[0].weekIncidence.toFixed(2)}</span><br />
          <span class="value">{data[0].cases.toLocaleString("de")}</span>
          <span class="addition">
            (+{data[0].delta.cases.toLocaleString("de")})</span
          ><br />
          <span class="value">{data[0].deaths.toLocaleString("de")}</span>
          <span class="addition">
            (+{data[0].delta.deaths.toLocaleString("de")})</span
          >
        </div>
      </div>
    </div>
    <div class="output">
      {#each districts as district, idx}
        <div
          class="outputContainer fade-in"
          style="animation-delay: {idx * 0.2 + 0.2}s"
        >
          <h3>
            {data[1].data[district].name}
            {#if data[1].data[district].ags == "03404"}(Stadt){/if}
            <span class="addition">
              ({data[1].data[district].population.toLocaleString("de")} Einwohner)
            </span>
          </h3>
          <div class="display--parent">
            <div class="display--child">
              <div class="title">Inzidenz</div>
              <span
                class="value"
                style="color: {data[1].data[district].weekIncidence >
                data[0].weekIncidence
                  ? 'red'
                  : data[1].data[district].weekIncidence <
                    data[0].weekIncidence / 2
                  ? 'green'
                  : 'black'}"
              >
                {data[1].data[district].weekIncidence.toFixed(2)}
              </span>
            </div>
            <div class="display--child">
              <div class="title">Fälle gesamt</div>
              <span class="value">
                {data[1].data[district].cases.toLocaleString("de")}
              </span><span class="addition"
                >(+{data[1].data[district].delta.cases})
              </span>
            </div>
            <div class="display--child">
              <div class="title">Tote</div>
              <span class="value">
                {data[1].data[district].deaths.toLocaleString("de")}
              </span><span class="addition"
                >(+{data[1].data[district].delta.deaths})
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
    <div class="update-hint">
      RKI-Daten Timestamp: {data[0].meta.lastUpdate
        .replace("T", " | ")
        .slice(0, -8)}
    </div>
  {/await}
</main>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: rotateX(90deg);
    }
    to {
      opacity: 1;
      transform: rotateX(0);
    }
  }
  @keyframes slideOut {
    from {
      transform: translateY(0%);
    }
    to {
      transform: translateY(-110%);
    }
  }
  h1 {
    text-align: center;
    margin: 0;
    padding: 0.5rem 0;
    line-height: 95%;
    color: white;
    font-size: 250%;
  }
  h3 {
    text-align: center;
    margin: 4px 0;
    line-height: 150%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
  }
  main {
    width: 100vw;
    min-height: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    background-image: linear-gradient(360deg, rgb(25, 28, 77), #008bcc);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-weight: 500;
    overflow: hidden;
    position: relative;
    padding-bottom: 100px;
  }
  main * {
    z-index: 1;
  }
  .bg-image {
    position: absolute;
    width: 100vw;
    height: 100%;
    top: 0;
    background-image: url("../img/bg.jpg");
    background-size: cover;
    background-position: center;
    opacity: 0.2;
  }
  .display--parent {
    display: flex;
    flex-direction: row;
    margin: 0 -2px;
  }
  .display--child {
    text-align: center;
    flex: 1;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 0.3rem;
    margin: 0 2px;
    border-radius: 4px;
  }
  .display--child:nth-child(2) {
    flex-basis: 18%;
  }
  .display--child .title {
    font-size: 90%;
  }
  .title {
    display: block;
  }
  .display--child .value {
    font-size: 140%;
  }
  .addition {
    font-size: 80%;
  }
  .outputContainer {
    width: 90vw;
    margin: 0.5rem auto;
    padding: 0.5rem;
  }
  .ger--parent {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 120%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    padding: 8px;
  }
  .loading {
    width: 90vw;
    margin: auto;
    text-align: center;
    background: rgba(255, 0, 0, 0.5);
    border: 1px solid rgb(255, 0, 0);
    color: white;
    font-size: 120%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
  }
  .fade-in {
    opacity: 0;
    transform: rotateX(90deg);
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  #time {
    display: block;
    font-size: 200%;
    margin: 3rem 0;
  }
  .update-hint {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    background: white;
    font-size: 80%;
    text-align: center;
    padding: 0.3rem;
    animation-name: slideOut;
    animation-delay: 10s;
    animation-duration: 1s;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
  }
</style>
