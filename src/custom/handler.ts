interface onSuccess {
  tokenId: string;
  transactionHash: string;
}

export async function onSuccess({ tokenId, hash }) {
  console.log(tokenId, hash);
  /**
        put your code here to process the result on success
    */
}

export async function onError(err: any) {
  console.log(err);
  /**
        put your code here to process the result on erro
    */
}
