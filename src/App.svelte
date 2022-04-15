<script>
  import Fab from "./Fab.svelte";
  import { districtStore } from "./store.js";
  let districts;

  let now = new Date();
  let sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();

  let dataCache = JSON.parse(localStorage.getItem("dataCache")) || {
    timestamp: 0,
    data: [],
  };

  function deleteCache() {
    localStorage.removeItem("dataCache");
    location.reload();
  }

  districtStore.subscribe((value) => {
    districts = value || ["05711", "05754", "03459"];
  });

  if (!districtStore) {
    districts = ["05711", "05754", "03459"];
  }

  let countryPromise = fetch("https://api.corona-zahlen.org/germany").then(
    (response) => {
      return response.json();
    }
  );

  let districtPromise = fetch("https://api.corona-zahlen.org/districts").then(
    (response) => {
      return response.json();
    }
  );

  let bothPromises;

  if (dataCache.timestamp > sixHoursAgo) {
    bothPromises = [dataCache.data[0], dataCache.data[1]];
  } else {
    bothPromises = Promise.all([countryPromise, districtPromise])
      .then(([country, districts]) => {
        let data = {
          timestamp: new Date(),
          data: [country, districts],
        };
        localStorage.setItem("dataCache", JSON.stringify(data));
        dataCache = data;
        return [country, districts];
      })
      .catch((error) => console.log(error));
  }

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
    let timeInSeconds = 30;
    let display = document.getElementById("time");
    startTimer(timeInSeconds, display);
  }
</script>

<main>
  <div class="bg-image" />
  <h1><small>Casumer</small><br />Corona Tracker</h1>
  {#await bothPromises}
    <h1>Loading ...</h1>
  {:then data}
    {#if !data[0].error && !data[1].error}
      <Fab {data} />
      <div class="outputContainer fade-in">
        <h3>Deutschland</h3>
        <div class="ger--parent">
          <div class="ger--child">
            <span class="title">Inzidenz:</span>
            <span class="title">Fälle gesamt:</span>
            <span class="title">Genesene:</span>
            <span class="title">Tote:</span>
            <span class="title">Aktive Fälle:</span>
          </div>
          <div class="ger--child">
            <span class="value">{data[0].weekIncidence.toFixed(2)}</span><br />
            <span class="value">{data[0].cases.toLocaleString("de")}</span>
            <span class="addition">
              (+{data[0].delta.cases.toLocaleString("de")})</span
            ><br />
            <span class="value">{data[0].recovered.toLocaleString("de")}</span>
            <span class="addition">
              (+{data[0].delta.recovered.toLocaleString("de")})</span
            ><br />
            <span class="value">{data[0].deaths.toLocaleString("de")}</span>
            <span class="addition">
              (+{data[0].delta.deaths.toLocaleString("de")})</span
            ><br />
            <span class="value"
              >{(
                data[0].cases -
                data[0].recovered -
                data[0].deaths
              ).toLocaleString("de")}</span
            >
            <span class="addition">
              (+{(
                data[0].delta.cases -
                data[0].delta.recovered -
                data[0].delta.deaths
              ).toLocaleString("de")})</span
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
              <span class="city"
                >{data[1].data[district].name}
                {#if data[1].data[district].ags == "03404"}(Stadt){/if}</span
              >
              <span class="addition">
                ({data[1].data[district].population.toLocaleString("de")} Einwohner)
              </span>
            </h3>
            <div class="display--parent">
              <div class="display--child">
                <div class="title">Inzidenz</div>
                <span
                  class="value"
                  style="color: {data[1].data[district].weekIncidence > 165
                    ? 'red'
                    : data[1].data[district].weekIncidence < 100
                    ? 'green'
                    : 'orange'}"
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
        Zuletzt aktualisiert: {new Date(dataCache.timestamp).toLocaleString(
          "de-DE"
        )}
        <div class="update-button" on:click={deleteCache}>Update</div>
      </div>
    {:else}
      <div class="loading" on:load={errorMessage()}>
        <div>
          <h2>Error!</h2>
          <div class="animation-frame">
            <span id="time">30</span>
          </div>
          <p>
            We could not read any Data from the RKI Corona API.<br />
            Maybe you called it too often!?
          </p>
          You have to wait for 30 seconds.
        </div>
      </div>
    {/if}
  {:catch error}
    <div>{error.message}</div>
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
      transform: translateY(calc((100% + 1rem) * -1));
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
    background: #222;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-weight: 500;
    overflow: hidden;
    position: relative;
    padding-bottom: 68px;
  }
  main * {
    z-index: 1;
  }
  .bg-image {
    position: absolute;
    width: 100vw;
    height: 100%;
    top: 0;
    background-image: url("../img/virus.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transform: translate(50%, -40vw);
    opacity: 0.5;
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
    padding: 0.2rem;
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
  .ger--child .title {
    text-align: right;
    padding-right: 1.2rem;
  }
  .display--child .value {
    font-size: 140%;
  }
  .addition {
    font-size: 80%;
    white-space: nowrap;
  }
  .outputContainer {
    width: clamp(300px, 90vw, 500px);
    margin: 0 auto;
    padding: 0.3rem 0;
    text-align: left;
  }
  .city {
    text-align: left;
  }
  .ger--parent {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    padding: 8px;
  }
  .loading {
    width: clamp(300px, 90vw, 500px);
    margin: auto;
    padding: 1rem;
    box-sizing: border-box;
    text-align: center;
    background: rgba(255, 0, 0, 0.5);
    border: 1px solid rgb(255, 0, 0);
    color: white;
    font-size: 120%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    opacity: 0;
    animation: fadeIn ease-in-out 0.5s forwards;
  }
  .animation-frame {
    margin: 2rem auto;
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-image: url("../img/tail-spin.svg");
    background-size: cover;
    transform: scaleX(-1);
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
    transform: scaleX(-1);
  }
  .update-hint {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: block;
    background: #ffffff;
    font-size: 80%;
    text-align: center;
    padding: 0.5rem;
    animation-name: slideOut;
    animation-delay: 3s;
    animation-duration: .6s;
    animation-timing-function: cubic-bezier(.38,-0.45,1,.42);
    animation-fill-mode: forwards;
    z-index: 5;
    margin: 0.5rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  .update-button {
    float: right;
    background-color: grey;
    color: white;
    padding: 0.5rem;
    margin: -0.5rem;
  }
</style>
