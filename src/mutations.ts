import { gql } from "graphql-request";

export const createAccount = gql`
  mutation CreateAccount($ens: String) {
    createAccount(input: { account: { id: "55", ens: $ens } }) {
      account {
        id
        ens
      }
    }
  }
`;
