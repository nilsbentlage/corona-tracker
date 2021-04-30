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

  onMount(async () => {
    for (const [key, value] of Object.entries(allDistricts)) {
      // console.log(key, value)
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
    let placeholder = document.getElementById("districtSearch");

    function searchError(text) {
      placeholder.value = "";
      placeholder.placeholder = text;
    }
    console.log(value);
    console.log(districtNumbers);

    if (value in districtNumbers) {
      if (districts.includes(districtNumbers[value])) {
        searchError("Diesem Kreis folgst du bereits!");
      } else {
        let pushValue = districtNumbers[value];
        districts.push(pushValue);
        districts = districts;
        districtStore.set(districts);

        localStorage.setItem("districts", JSON.stringify(districts));
        searchError("Hinzugefügt!");
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

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + " ...";
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
        placeholder="Gib hier den Namen eines Landkreises ein ..."
      />
      <datalist id="districts" /><br />
      <button class="add" on:click={addDistrict}>Hinzufügen</button>
    </div>
    <div class="districtList">
      <h2 class="head">Meine Landkreise</h2>
      {#each districts as district}
        <div
          class="singleDistrict"
          data-key={district}
          transition:slide={{ duration: 300 }}
        >
          <span class="title"
            >{truncateString(
              district == "03404" ? osnaHack : allDistricts?.[district].name,
              25
            )}</span
          ><button on:click={deleteDistrict} class="delete">Löschen</button>
        </div>
      {/each}
    </div>
    <button class="reset" on:click={resetDistricts}>Alle zurücksetzen</button>
  {/if}
</div>

<style>
  .singleDistrict {
    width: clamp(200px, 90vw, 500px);
    margin: auto;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 115%;
    font-weight: 400;
  }
  .districtList {
    overflow-y: scroll;
    max-height: 100vh;
  }
  h2.head {
    border-bottom: 1px solid white;
  }

  .title {
    text-align: left;
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
  }

  .add {
    margin-top: 1rem;
    text-align: center;
    font-size: 120%;
    background: rgb(16, 175, 29);
  }
  .delete {
    background-color: red;
  }
  .reset {
    background: grey;
    margin-top: 3rem;
  }
  #districtSearch {
    width: clamp(200px, 80vw, 500px);
  }
</style>
