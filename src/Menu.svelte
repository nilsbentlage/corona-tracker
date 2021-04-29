<script>
  import { onMount } from "svelte";

  export let data;
  let allDistricts = data[1].data || null;
  let districts = JSON.parse(localStorage.getItem("districts")) || [
    "05711",
    "05754",
    "03459",
    "03404",
  ];
  let districtNumbers = {};
  console.log(allDistricts);

  onMount(async () => {
    let target = document.getElementById("districts");
    console.log(target);
    for (const [key, value] of Object.entries(allDistricts)) {
      Object.assign(districtNumbers, { [value.name]: key });
      let option = document.createElement("OPTION");
      option.setAttribute("value", value.name);
      document.getElementById("districts").appendChild(option);
    }
    console.log(districtNumbers);
  });

  function addDistrict() {
    let value = document.getElementById("districtSearch").value;
    if (value in districtNumbers) {
      console.log(value);
      districts.push(districtNumbers[value]);
      localStorage.setItem("districts", JSON.stringify(districts));
      document.getElementById("districtSearch").value = "";
      location.reload();
    } else {
      document.getElementById("districtSearch").value = "";
      document.getElementById("districtSearch").placeholder =
        "Diese Stadt gibt es nicht!";
    }
  }

  function resetDistricts() {
    localStorage.removeItem("districts");
    location.reload();
  }

  function deleteDistrict(event) {
    let arrayKey = event.target.parentNode.dataset.key;
    console.log(arrayKey);
    districts = districts.filter((x) => x != arrayKey);
    localStorage.setItem("districts", JSON.stringify(districts));
    setTimeout(() => {
      location.reload();
    }, 300);
  }
</script>

<div class="menu">
  {#if districts}
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
          <span class="title">{allDistricts?.[district]?.name}</span><span
            on:click={deleteDistrict}
            class="delete">Löschen</span
          >
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
  .delete {
    background-color: red;
    padding: 2px 8px;
    border-radius: 4px;
  }
  .title {
    text-align: left;
  }
  .menu {
    padding: 1em 0;
    color: white;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 2rem 0px;
    box-sizing: border-box;
  }
  .formular {
    padding-top: 3rem;
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
