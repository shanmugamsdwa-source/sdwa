import { redirect } from 'next/navigation';

interface LegacySlugProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyInstitutionSlugPage({ params }: LegacySlugProps) {
  const { slug } = await params;
  redirect(`/affiliated-centres/${slug}`);
}
