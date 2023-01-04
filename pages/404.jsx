import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1 className="text-2xl text-error">404 - Page Not Found</h1>
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
