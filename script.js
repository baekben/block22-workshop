const newPartyForm = document.querySelector("#new-party-form");
const partyContainer = document.querySelector("#party-container");

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  // your code here
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: "DELETE",
    });
    const party = await response.json();
    console.log(party);
    getAllParties();
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    if (!id || id.length == 0) {
      partyContainer.innerHTML = "<h3>No Party Found</h3>";
      return;
    }
    // fetch party details from server
    const party = await getPartyById(id);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // // GET - get all gifts by party id - /api/workshop/gifts/party/:partyid
    // const giftsResponse = await fetch(`${GIFTS_API_URL}/party/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    let guestList;
    if (!guests || guests.length === 0) {
      guestList = `No guests`;
    } else {
      guestList = `<ul>${guests
        .map(
          (guest, index) =>
            `<li><div>${guest.name}</div><div>
            <b>Status: </b>${rsvps[index].status}</div></li>`
        )
        .join("")}</ul>`;
    }
    let partyDetailsElement = `
    <div class="party-details"><h2>${party.name}</h2>
    <p><b>Description:</b> ${party.description}</p>
    <p><b>Date:</b> ${party.date}</p>
    <p><b>Time:</b> ${party.time}</p>
    <p><b>Location:</b> ${party.location}</p>
    <p>${guestList}</p>
    <button class="close-button">Close</button></div>
            
        `;
    partyContainer.innerHTML = partyDetailsElement;

    // add event listener to close button
    const closeButton = partyContainer.querySelector(".close-button");
    closeButton.addEventListener("click", async () => {
      const parties = await getAllParties();
      renderParties(parties);
    });
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = "";
    parties.forEach((party) => {
      const partyElement = document.createElement("div");
      partyElement.classList.add("party");
      partyElement.innerHTML = `
      <h2>${party.name}</h2>
    <p><b>Description:</b> ${party.description}</p>
    <p><b>Date:</b> ${party.date}</p>
    <p><b>Time:</b> ${party.time}</p>
    <p><b>Location:</b> ${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        // your code here
        let selectedId = event.target.dataset.id;
        renderSinglePartyById(selectedId);
      });

      // delete party
      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        // your code here
        let partyId = event.target.dataset.id;
        deleteParty(partyId);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  // your code here
  let parties = await getAllParties();
  renderParties(parties);
};

init();
