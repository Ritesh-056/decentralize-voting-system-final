
const saveVotedElectionIndicesToLocal = (titleIndex, accountAddress) => {
    // Get the existing stored value for the account (if any)
    // [ if already voted to the election]
    const existingValue = localStorage.getItem(
      `votedElectionIndices_${accountAddress}`
    );

    console.log("Account address:", accountAddress);
    console.log("Getting indicies",existingValue);

    // if no value associated with the account then, creating a new array
    let indices = existingValue ? JSON.parse(existingValue) : [];

    // Adding the new title to the array.
    indices.push(titleIndex);

    console.log("After setting indicies",indices);

    // Serializing the array into a string
    //and storing it in localStorage
    localStorage.setItem(
      `votedElectionIndices_${accountAddress}`,
      JSON.stringify(indices)
    );
  };

  export {saveVotedElectionIndicesToLocal};