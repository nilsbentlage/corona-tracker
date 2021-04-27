<script>
  let allDistricts = JSON.parse(localStorage.getItem("cache")).data;
  let districts = JSON.parse(localStorage.getItem("districts")) || ["05711", "05754", "03459", "03404"];
  let districtNumbers = {};

  window.onload = function () {
    let target = document.getElementById("districts");
    console.log(target);
    for (const [key, value] of Object.entries(allDistricts)) {
      Object.assign(districtNumbers, { [value.name]: key });
      let option = document.createElement("OPTION");
      let textNode = document.createTextNode(value.name);
      option.setAttribute("value", key);
      option.appendChild(textNode);
      document.getElementById("districts").appendChild(option);
    }
    console.log(districtNumbers);
  };

  function addDistrict() {
    let value = document.getElementById("districtSearch").value;
    console.log(value);
    districts.push(value);
    localStorage.setItem("districts", JSON.stringify(districts));
    document.getElementById("districtSearch").value = "";
  }

  function deleteDistrict(event) {
    let arrayKey = event.target.parentNode.dataset.key;
    console.log(arrayKey);
    districts = districts.filter(x => (x != arrayKey));
    localStorage.setItem("districts", JSON.stringify(districts));
  }
</script>

<div class="menu">
  <h2>Welchen Ort möchtest du hinzufügen?</h2>
  <form>
    <label for="districtSearch">Landkreis</label>
    <input
      type="search"
      list="districts"
      id="districtSearch"
      name="districtSearch"
    />
    <datalist id="districts" /><br />
    <button on:click={addDistrict}>Hinzufügen</button>
  </form>
  <div class="districtList">
    {#each districts as district}
      <div class="singleDistrict" data-key={district}>
        <span class="title">{allDistricts[district]?.name}</span><span
          on:click={deleteDistrict}
          class="delete">Löschen</span
        >
      </div>
    {/each}
  </div>
</div>

<style>
  .singleDistrict {
    width: clamp(200px, 80vw, 500px);
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;
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
    padding: 4rem 0;
    color: white;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 2rem 0px;
    box-sizing: border-box;
  }
  form {
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
