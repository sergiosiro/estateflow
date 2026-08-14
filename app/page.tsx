import HomeScreen from "@/components/HomeScreen";
import { getProperties } from "@/lib/properties";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const rawPage = typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const page = Math.max(1, parseInt(rawPage, 10) || 1);

  const { properties, totalCount, totalPages, currentPage, pageSize } =
    await getProperties(page, 6);

  return (
    <HomeScreen
      properties={properties}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      pageSize={pageSize}
    />
  );
}
