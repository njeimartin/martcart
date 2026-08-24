import Link from 'next/link';
import TriggersShell from '@/components/TriggersShell';

const posts = [
  ['GUIDE','Choosing the Perfect Tactical Backpack','What to look for in capacity, organization, comfort and weather resistance.'],
  ['SURVIVAL','Top Outdoor Essentials for Your Next Adventure','A practical checklist for camping, hiking and unexpected situations.'],
  ['FIELD NOTES','How to Build a Smarter Everyday Carry','Start with the essentials, remove the clutter and choose equipment you will actually use.'],
];

export default function BlogPage(){return <TriggersShell><section className="inner-hero blog-hero"><div className="trigger-container"><span>FROM THE FIELD</span><h1>TACTICAL<br /><em>FIELD NOTES.</em></h1><p>Guides, gear knowledge and practical ideas for staying ready.</p></div></section><section className="trigger-container content-section"><div className="trigger-heading"><div><span>TRIGGERS NATION JOURNAL</span><h2>LATEST ARTICLES</h2></div></div><div className="blog-grid">{posts.map(([tag,title,desc])=><article className="blog-post" key={title}><span>{tag}</span><h3>{title}</h3><p>{desc}</p><Link href="/contact">READ MORE →</Link></article>)}</div></section></TriggersShell>}
