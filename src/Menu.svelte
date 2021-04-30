<script>
  import { onMount } from "svelte";

  export let data;
  let allDistricts = data[1].data || null;
  let districts = JSON.parse(localStorage.getItem("districts")) || [
    "05711",
    "05754",
    "03459" ];
  let districtNumbers = {};
  let osnaHack = "Osnabrück (Stadt)";

  onMount(async () => {
    for (const [key, value] of Object.entries(allDistricts)) {
      let newValue = value.name;
      key == "03404" ? (newValue = osnaHack) : (newValue = value.name);
      Object.assign(districtNumbers, { [value.name]: key });
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
    if (value in districtNumbers) {
      if (districts.includes(districtNumbers[value])) {
        searchError("Diesem Kreis folgst du bereits!");
      } else {
        let pushValue = districtNumbers[value];
        districts.push(pushValue);
        localStorage.setItem("districts", JSON.stringify(districts));
        searchError("Hinzugefügt!");
        location.reload();
      }
    } else {
      searchError("Diesen Landkreis gibt es nicht!");
    }
  }

  function resetDistricts() {
    localStorage.removeItem("districts");
    location.reload();
  }

  function deleteDistrict(event) {
    let arrayKey = event.target.parentNode.dataset.key;
    districts = districts.filter((x) => x != arrayKey);
    localStorage.setItem("districts", JSON.stringify(districts));
    setTimeout(() => {
      location.reload();
    }, 300);
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
      <button on:click={addDistrict}>Hinzufügen</button>
    </div>
    <div class="districtList">
      {#each districts as district}
        <div class="singleDistrict" data-key={district}>
          <span class="title"
            >{truncateString(
              district == "03404" ? osnaHack : allDistricts?.[district].name,
              25
            )}</span
          ><span on:click={deleteDistrict} class="delete">Löschen</span>
        </div>
      {/each}
    </div>
    <button class="reset" on:click={resetDistricts}>Alle zurücksetzen</button>
  {/if}
</div>

<style>
  .reset {
    background: grey;
    margin-top: 3rem;
  }
  .singleDistrict {
    width: clamp(200px, 90vw, 500px);
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 2rem;
    font-size: 115%;
    font-weight: 400;
  }
  .districtList {
    overflow-y: scroll;
    max-height: 100vh;
  }
  .delete {
    background-color: red;
    padding: 2px 8px;
    border-radius: 4px;
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
    margin-top: 1rem;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-size: 120%;
    border: none;
    outline: none;
    border-radius: 4px;
    background-image: linear-gradient(
      360deg,
      rgb(40, 180, 52),
      rgb(58, 255, 74)
    );
    color: white;
    padding: 4px 24px;
  }
  #districtSearch {
    width: clamp(200px, 80vw, 500px);
  }
</style>
