import { getItem } from "lib/db";

async function getApartment() {
  return getItem("adverts-apartments", "tr_52302973");
}


export default async function Page() {
  const i = await getApartment();
    return (
      <>
      {JSON.stringify(i)}
      </>
    );
  }
