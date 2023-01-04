import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Custom500() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1 className="text-2xl text-error">500 - Server-side error occurred</h1>
    </div>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "product"])),
    },
  };
}
