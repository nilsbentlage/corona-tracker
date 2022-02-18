<script>
  import { onMount } from "svelte";
  import { districtStore } from "./store.js";
  import { slide } from "svelte/transition";

  export let data;
  let allDistricts = data[1].data || null;
  let districts = JSON.parse(localStorage.getItem("districts")) || [
    "05711",
    "05754",
    "03459",
  ];
  let districtNumbers = {};
  let osnaHack = "Osnabrück (Stadt)";
  let isError = false;

  onMount(async () => {
    for (const [key, value] of Object.entries(allDistricts)) {
      let newValue = value.name;
      key == "03404" ? (newValue = osnaHack) : (newValue = value.name);
      Object.assign(districtNumbers, { [newValue]: key });
      let option = document.createElement("OPTION");
      option.setAttribute("value", newValue);
      document.getElementById("districts").appendChild(option);
    }
  });
  function addDistrict() {
    let value = document.getElementById("districtSearch").value;
    let placeholder = document.getElementById("error-box");

    function searchError(text) {
      placeholder.value = "";
      placeholder.innerText = text;
      isError = true;
      setTimeout(() => {
        placeholder.innerText = " ";
        isError = false;
      }, 5000);
    }

    if (value in districtNumbers) {
      if (districts.includes(districtNumbers[value])) {
        searchError("Diesem Kreis folgst du bereits!");
      } else {
        let pushValue = districtNumbers[value];
        districts.push(pushValue);
        districts = districts;
        districtStore.set(districts);
        localStorage.setItem("districts", JSON.stringify(districts));
        document.getElementById("districtSearch").value = "";
      }
    } else {
      searchError("Diesen Landkreis gibt es nicht!");
    }
  }

  function resetDistricts() {
    localStorage.removeItem("districts");
    districtStore.set(null);
    districts = ["05711", "05754", "03459"];
  }

  function deleteDistrict(event) {
    let arrayKey = event.target.parentNode.dataset.key;
    districts = districts.filter((x) => x != arrayKey);
    districtStore.set(districts);
    localStorage.setItem("districts", JSON.stringify(districts));
  }
</script>

<div class="menu">
  {#if districts && allDistricts}
    <div class="formular">
      <h2>Welchen Ort möchtest du hinzufügen?</h2>
      <input
        list="districts"
        id="districtSearch"
        name="districtSearch"
        autocomplete="on"
        placeholder="Landkreis suchen"
        style="border-bottom: 1px solid {isError ? 'red' : 'white'}"
      />
      <datalist id="districts" />
      <div id="error-box" />
      <button class="add" on:click={addDistrict} aria-label="Add District">Hinzufügen</button>
    </div>
    <div class="list-wrapper">
      <h2 class="head">Meine Landkreise</h2>
      <div class="districtList">
        {#each districts as district}
          <div
            class="singleDistrict"
            data-key={district}
            transition:slide={{ duration: 300 }}
          >
            <span class="title"
              >{district == "03404"
                ? osnaHack
                : allDistricts?.[district].name}</span
            ><button on:click={deleteDistrict} class="delete" aria-label="Delete District"/>
          </div>
        {/each}
      </div>
    </div>

    <button class="reset" on:click={resetDistricts}>Zurücksetzen</button>
  {/if}
</div>

<style>
  .list-wrapper {
    text-align: center;
  }
  .singleDistrict {
    margin: 0;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 115%;
    font-weight: 400;
    background: #444;
    border-radius: 4px;
    padding: 0;
    padding-left: 12px;
    box-sizing: border-box;
    max-width: 90vw;
  }
  .singleDistrict:first-child {
    margin-top: 20px;
  }
  #error-box {
    color: red;
    font-size: 80%;
    height: 0.3rem;
    transform: translateY(-6px);
    transition: all 0.5s;
  }
  .districtList {
    --custom-height: clamp(150px, 35vh, 350px);
    overflow-y: scroll;
    max-height: var(--custom-height);
    -webkit-mask-box-image: linear-gradient(180deg, transparent, black 20px, black calc(var(--custom-height) - 20px), transparent var(--custom-height));
  }
  h2.head {
    border-bottom: 1px solid white;
    width: clamp(200px, 90vw, 500px);
    margin: auto;
    margin-top: 1rem;
  }

  .title {
    text-align: left;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .menu {
    padding: 1em 0 5em;
    color: white;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: 2rem 0px;
    box-sizing: border-box;
    max-height: 100vh;
  }
  button {
    border: none;
    outline: none;
    border-radius: 4px;
    color: white;
    padding: 6px 12px;
    cursor: pointer;
    margin: 0;
    font-size: 80%;
  }

  .add {
    margin-top: 1rem;
    text-align: center;
    font-size: 120%;
    background: rgb(16, 175, 29);
  }
  .delete {
    background-color: white;
    border-radius: 0 4px 4px 0;
    width: 48px;
    height: 48px;
    background-image: url("../img/trash.svg");
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
    flex: 0 0 48px;
  }
  .reset {
    background: #444;
    margin-top: 1rem;
  }
  #districtSearch {
    width: clamp(200px, 90vw, 500px);
    background-color: rgba(0, 0, 0, 0);
    border: none;
    outline: none;
    font-size: 130%;
    border-bottom: 1px solid white;
    color: white;
    font-size: 130%;
    text-align: center;
  }
</style>
