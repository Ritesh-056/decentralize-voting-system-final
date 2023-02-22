async function getCandidatesCountFromSelectedElection(ElectionInstanceMethods, index) {
    const candidatesCount = await ElectionInstanceMethods.getCandidateCountForAsscociatedElection(index).call();
    return candidatesCount;
  }

async function getCandidatesFromSelectedElection(ElectionInstanceMethods, index) {
    const candidates = await ElectionInstanceMethods.getCandidatesForAssociatedElections(index).call();
    return candidates;
  }

export {getCandidatesCountFromSelectedElection,getCandidatesFromSelectedElection};