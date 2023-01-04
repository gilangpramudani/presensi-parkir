import { gql } from "@apollo/client";

export const GET_LIST_TUKANG = gql`
query GetTukang {
    tukang(limit: 1000) {
      nama
      rt
      id
    }
  }
`
