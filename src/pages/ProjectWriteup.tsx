import { useNavigate, useParams } from 'react-router';
import { RetroWindow } from '../app/components/retro/RetroWindow';
import { Taskbar } from '../app/components/retro/Taskbar';
// Single source of truth — also consumed by scripts/prerender-writeups.mjs for
// the static, crawlable version at dist/projects/<slug>/index.html.
import { writeups } from '../../scripts/writeups.mjs';

type Section = { h2: string; body?: string; steps?: string[]; table?: [string, string][] };
type Writeup = {
  slug: string;
  name: string;
  title: string;
  description: string;
  lede: string;
  context: string;
  liveUrl: string | null;
  repoUrl: string | null;
  sections: Section[];
  faq: { q: string; a: string }[];
  demo?: { src: string | null; poster: string | null; caption: string };
};

export function ProjectWriteup() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const w = (writeups as Writeup[]).find((x) => x.slug === slug);

  if (!w) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 pb-16 font-sans">
        <RetroWindow title="404 - project not found" icon="📁" onClose={() => navigate('/projects')} className="w-full max-w-md">
          <div className="p-4 bg-white text-black text-sm">
            <p className="mb-3">No writeup for “{slug}”.</p>
            <button onClick={() => navigate('/projects')} className="underline text-blue-700">← Back to Projects</button>
          </div>
        </RetroWindow>
        <Taskbar />
      </div>
    );
  }

  const others = (writeups as Writeup[]).filter((x) => x.slug !== w.slug);

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(transparent_95%,rgba(255,0,255,0.3)_100%),linear-gradient(90deg,transparent_95%,rgba(255,0,255,0.3)_100%)] bg-[length:40px_40px] flex items-start justify-center p-4 md:p-8 pb-20 relative font-sans">
      <RetroWindow
        title={`${w.name} — case_study.md`}
        icon="📄"
        windowId={`writeup-${w.slug}`}
        className="w-full max-w-3xl my-4 z-10"
        onClose={() => navigate('/projects')}
      >
        <div className="bg-white text-black overflow-y-auto max-h-[82vh] p-5 md:p-8 border-t-2 border-l-2 border-t-gray-500 border-l-gray-500 m-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{w.name}</h1>
          <p className="text-base md:text-lg text-gray-800 mb-4">{w.lede}</p>

          <div className="flex flex-wrap gap-3 text-sm mb-6 font-mono">
            {w.liveUrl && (
              <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Live demo ↗</a>
            )}
            {w.repoUrl && (
              <a href={w.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Source ↗</a>
            )}
            {!w.liveUrl && !w.repoUrl && (
              <button onClick={() => navigate('/research')} className="text-blue-700 underline">See on Research ↗</button>
            )}
          </div>

          {/* Demo media (rendered only when a real recording exists) */}
          {w.demo?.src && (
            <figure className="mb-6">
              <video
                src={w.demo.src}
                poster={w.demo.poster || undefined}
                muted
                loop
                playsInline
                autoPlay
                controls
                className="w-full border-2 border-gray-400 bg-black"
              />
              <figcaption className="text-xs text-gray-500 mt-1">{w.demo.caption}</figcaption>
            </figure>
          )}

          <h2 className="text-xl font-bold border-l-4 border-[#000080] pl-2 mt-6 mb-2">What it is</h2>
          <p className="mb-4 leading-relaxed">{w.context}</p>

          {w.sections.map((s) => (
            <section key={s.h2}>
              <h2 className="text-xl font-bold border-l-4 border-[#000080] pl-2 mt-6 mb-2">{s.h2}</h2>
              {s.body && <p className="mb-3 leading-relaxed">{s.body}</p>}
              {s.steps && (
                <ol className="list-decimal pl-6 mb-3 space-y-1">
                  {s.steps.map((st, i) => (
                    <li key={i} className="leading-relaxed">{st}</li>
                  ))}
                </ol>
              )}
              {s.table && (
                <table className="w-full text-sm border-collapse mb-3">
                  <tbody>
                    {s.table.map(([k, v]) => (
                      <tr key={k} className="border-b border-gray-200 align-top">
                        <th scope="row" className="text-left py-1 pr-3 font-semibold text-[#4a4a9a] whitespace-nowrap w-1/3">{k}</th>
                        <td className="py-1">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))}

          <h2 className="text-xl font-bold border-l-4 border-[#000080] pl-2 mt-6 mb-2">FAQ</h2>
          {w.faq.map((f) => (
            <div key={f.q} className="mb-3">
              <h3 className="font-bold text-[#000080]">{f.q}</h3>
              <p className="leading-relaxed">{f.a}</p>
            </div>
          ))}

          <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600 font-mono">
            More case studies:{' '}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && ' · '}
                <button onClick={() => navigate(`/projects/${o.slug}`)} className="text-blue-700 underline">{o.name}</button>
              </span>
            ))}
            {' · '}
            <button onClick={() => navigate('/projects')} className="text-blue-700 underline">all projects</button>
          </div>
        </div>
      </RetroWindow>
      <Taskbar />
    </div>
  );
}
