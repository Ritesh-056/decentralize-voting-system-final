// get election title and slogan title index from local storage
function getElectionTitleAndSloganIndexFromLocal(electionTitleIndex) {
    const indicesString = localStorage.getItem(
      `electionTitleIndices_${electionTitleIndex}`
    );

    if (!indicesString) {
      return []; // return empty array if no saved data found
    }

    const indices = JSON.parse(indicesString);
    return indices;
}

// save election title and slogan title index to local storage
function saveElectionTitleAndSloganIndexToLocal(electionTitleIndex, sloganTitleIndex) {

     // Get the existing slogan tiles for the election (if any)
    // [ if already stored the slogan to the particular election title index
    const existingsloganForElection = localStorage.getItem(
        `electionTitleIndices_${electionTitleIndex}`
      );

       // if no value associated with the election title index then, creating a new array
       let indices = existingsloganForElection ? JSON.parse(existingsloganForElection) : [];
    // Adding the new slogan to the array.
      indices.push(sloganTitleIndex);

          // Serializing the array into a string
      //and storing it in localStorage
      localStorage.setItem(
        `electionTitleIndices_${electionTitleIndex}`,
        JSON.stringify(indices)
      );
}

export {
  saveElectionTitleAndSloganIndexToLocal,
  getElectionTitleAndSloganIndexFromLocal
};
