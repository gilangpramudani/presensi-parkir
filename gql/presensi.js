import { gql } from "@apollo/client";

export const POST_PRESENSI_DATANG = gql`
mutation InsertPresensi($datang: String, $jenis_presensi_datang: String, $jenis_presensi_pergi: String, $pergi: String, $sesi_id: uuid, $tukang_id: uuid) {
    insert_presensi(objects: {datang: $datang, jenis_presensi_datang: $jenis_presensi_datang, jenis_presensi_pergi: $jenis_presensi_pergi, pergi: $pergi, sesi_id: $sesi_id, tukang_id: $tukang_id}) {
      affected_rows
      returning {
        datang
              jenis_presensi_datang
              jenis_presensi_pergi
              pergi
              id
              sesi_id
              tukang_id
      }
    }
  }
  `

export const POST_UPSERT_PRESENSI_DATANG = gql`
  mutation InsertPresensi($datang: String, $id: String, $jenis_presensi_datang: String, $jenis_presensi_pergi: String, $pergi: String, $sesi_id: uuid, $tukang_id: uuid) {
    insert_presensi(objects: {datang: $datang, id: $id, jenis_presensi_datang: $jenis_presensi_datang, jenis_presensi_pergi: $jenis_presensi_pergi, pergi: $pergi, sesi_id: $sesi_id, tukang_id: $tukang_id}, on_conflict: {constraint: presensi_pkey, where: {id: {_eq: "a29df05b-7b7f-42f3-a948-16a71e6151ac+11758d93-33f3-4c01-972c-5d6c8ce9f7db"}}, update_columns: datang}) {
      affected_rows
      returning {
        datang
        id
        jenis_presensi_datang
        jenis_presensi_pergi
        pergi
        sesi_id
        tukang_id
      }
    }
  }
  `