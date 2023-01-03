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

export const GET_SESI_BUKA_HARI_INI = gql`
query GetSesi {
    sesi(where: {buka: {_eq:true}}) {
      buka
      tanggal
      hari_ke
      id
      presensis {
        tukang_id
        id
        pergi
        jenis_presensi_pergi
        jenis_presensi_datang
        datang
      }
    }
  }
  `