import { ImageResponse } from 'next/og';
// 使用相对路径导入，适配 Satori 引擎的环境
import { zh } from './i18n/zh';
import { en } from './i18n/en';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export function generateOGImage(titleKey: string, lang: string = 'zh') {
  const dict = (lang === 'en' ? en : zh) as Record<string, string>;
  const title = dict[titleKey] || titleKey;
  const slogan = dict['og.slogan'] || 'DogUp - Developer\'s Toolbox';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#020617',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '80px',
          color: 'white',
        }}
      >
        {/* 背景装饰：Glow 放在最底层 */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <defs>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#glowGradient)" />
        </svg>

        {/* 网格装饰：层级在 Glow 之上 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            display: 'flex',
          }}
        />

        {/* 左上角修饰：代码感占位 */}
        <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.4 }}>
            <div style={{ display: 'flex', width: '120px', height: '12px', background: '#3b82f6', borderRadius: '6px' }} />
            <div style={{ display: 'flex', width: '80px', height: '12px', background: '#6366f1', borderRadius: '6px' }} />
        </div>

        {/* 右下角修饰：几何图形 */}
        <div style={{ position: 'absolute', bottom: '100px', right: '40px', display: 'flex', opacity: 0.2 }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="10 5" />
                <rect x="60" y="60" width="80" height="80" stroke="#6366f1" strokeWidth="2" fill="none" transform="rotate(45 100 100)" />
            </svg>
        </div>

        {/* 标题容器 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* 装饰性小字 */}
          <div style={{ display: 'flex', fontSize: '24px', color: '#3b82f6', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '4px' }}>
            TERMINAL / TOOLS / ONLINE
          </div>
          
          <h1
            style={{
              fontSize: '110px',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              padding: 0,
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {title}
          </h1>

          {/* 分隔线 */}
          <div style={{ display: 'flex', width: '160px', height: '4px', background: 'linear-gradient(to right, #3b82f6, #6366f1)', borderRadius: '2px', margin: '40px 0' }} />
        </div>

        {/* 底部 Slogan */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 40px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              color: '#94a3b8',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {slogan}
          </span>
        </div>

        {/* 底部边缘发光 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, transparent, #3b82f6, #8b5cf6, #3b82f6, transparent)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
