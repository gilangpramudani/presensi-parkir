import { gql } from "@apollo/client";

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
export const POST_BUAT_SESI = gql`
  mutation InsertSesi($buka: Boolean, $tanggal:date) {
    insert_sesi(objects: {buka: $buka, tanggal: $tanggal,hari_ke: 0}) {
      affected_rows
      returning {
        id
        tanggal
        hari_ke
        buka
      }
    }
  }
  
  `

export const POST_TUTUP_SESI = gql`
  mutation InsertSesi ($id:uuid){
    update_sesi(where: {id: {_eq: $id}}, _set: {buka: false}) {
      returning {
        id
      }
    }
  }
  `