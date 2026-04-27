/* ============================================================
   SCRIBBLE GREEN — ARTICLES.JS
   Central articles data store + dynamic related articles renderer.

   To add a new article:
   1. Add an entry to the ARTICLES array below.
   2. Create the HTML file (copy ../post/blog-post-template.html).
   3. Set the current article's id in the <article> tag:
      <article data-article-id="YOUR_ID">

   Tags drive the "Related Articles" sidebar widget.
   ============================================================ */

const ARTICLES = [
    {
        id       : 1,
        title    : 'How AI is Reshaping the Academic Research Workflow in 2025',
        excerpt  : 'A deep dive into how tools like Notebook LM are transforming how researchers synthesise literature and build arguments.',
        url      : './posts/how-ai-is-shaping-the-academic-research-workflow-in-2026.html',
        category : 'AI & Research',
        author   : { name: 'John Morounfoluwa', initials: 'JM', role: 'Founder & Lead Researcher' },
        date     : 'March 12, 2025',
        readTime : '8 min',
        tags     : ['ai', 'research', 'academic'],
        icon     : 'analytics'
    },
    {
        id       : 2,
        title    : 'Grant Writing That Works: What Funders Actually Want to Read',
        excerpt  : 'Lessons from reviewing hundreds of proposals — and the five structural mistakes that cost applicants the most.',
        url      : './posts/grant-writing-that-works.html',
        category : 'Writing',
        author   : { name: 'Murewa Newo', initials: 'MN', role: 'Marketing Lead' },
        date     : 'February 5, 2025',
        readTime : '7 min',
        tags     : ['writing', 'grants', 'research'],
        icon     : 'edit'
    },
    {
        id       : 3,
        title    : 'The ATS Problem: Why 75% of CVs Never Reach a Human Eye',
        excerpt  : 'Understanding how applicant tracking systems score your CV — and the simple fixes that make all the difference.',
        url      : './posts/the-ats-problem.html',
        category : 'Career',
        author   : { name: 'Stephen Umurie', initials: 'SU', role: 'Technical Lead' },
        date     : 'January 20, 2025',
        readTime : '4 min',
        tags     : ['career', 'cv', 'jobs'],
        icon     : 'work'
    },
    // {
    //     id       : 4,
    //     title    : 'Why Nigerian Businesses Are Losing Content Battles They Should Be Winning',
    //     excerpt  : 'An analysis of common content strategy failures in Nigerian corporate communications — and a practical framework for fixing them.',
    //     url      : './posts/blog-post-template.html',
    //     category : 'Strategy',
    //     author   : { name: 'John Morounfoluwa', initials: 'JM', role: 'Founder & Lead Researcher' },
    //     date     : 'January 8, 2025',
    //     readTime : '9 min',
    //     tags     : ['strategy', 'content', 'africa'],
    //     icon     : 'trending_up'
    // },
    // {
    //     id       : 5,
    //     title    : 'Notebook LM vs ChatGPT for Research: A Practical Comparison',
    //     excerpt  : 'We put both tools through their paces across six research scenarios. Here\'s what we found — and which one wins for academic work.',
    //     url      : './posts/blog-post-template.html',
    //     category : 'AI & Technology',
    //     author   : { name: 'Stephen Umurie', initials: 'SU', role: 'Technical Lead' },
    //     date     : 'December 14, 2024',
    //     readTime : '6 min',
    //     tags     : ['ai', 'research', 'tools'],
    //     icon     : 'auto_awesome'
    // },
    // {
    //     id       : 6,
    //     title    : 'Desk Research vs Primary Research: Choosing the Right Approach',
    //     excerpt  : 'A clear, jargon-free guide to understanding when to collect your own data — and when existing literature is enough.',
    //     url      : './posts/blog-post-template.html',
    //     category : 'Research',
    //     author   : { name: 'Murewa Newo', initials: 'MN', role: 'Marketing Lead' },
    //     date     : 'November 28, 2024',
    //     readTime : '5 min',
    //     tags     : ['research', 'methodology', 'academic'],
    //     icon     : 'science'
    // }
];

/**
 * Returns up to `limit` articles that share at least one tag
 * with `currentTags`, excluding the article with `currentId`.
 */
function getRelatedArticles(currentTags, currentId, limit = 4) {
    return ARTICLES
        .filter(a => a.id !== currentId && a.tags.some(t => currentTags.includes(t)))
        .sort((a, b) => {
            // Sort by number of matching tags (descending)
            const aMatches = a.tags.filter(t => currentTags.includes(t)).length;
            const bMatches = b.tags.filter(t => currentTags.includes(t)).length;
            return bMatches - aMatches;
        })
        .slice(0, limit);
}

/**
 * Renders related articles into the sidebar widget.
 * The <article> element must have data-article-id and data-article-tags attributes.
 * Example: <article data-article-id="1" data-article-tags="ai,research,academic">
 */
function renderRelatedArticles() {
    const container = document.getElementById('relatedArticlesList');
    if (!container) return;

    const articleEl = document.querySelector('[data-article-id]');
    if (!articleEl) return;

    const currentId   = parseInt(articleEl.dataset.articleId, 10);
    const currentTags = (articleEl.dataset.articleTags || '').split(',').map(t => t.trim());
    const related     = getRelatedArticles(currentTags, currentId, 4);

    if (!related.length) {
        container.closest('.sidebar-widget')?.remove();
        return;
    }

    container.innerHTML = related.map(a => `
    <a href="${a.url}" class="related-article-item">
      <div class="related-article-item__img">
        <span class="material-icons-round">${a.icon}</span>
      </div>
      <div class="related-article-item__text">
        <div class="ra-cat">${a.category}</div>
        <h5>${a.title}</h5>
      </div>
    </a>
  `).join('');
}

/**
 * Renders all articles into a grid container on events-insights.html.
 * Target element: <div id="articlesGrid">
 * Optional active filter: data attribute on filter buttons.
 */
function renderArticlesGrid(filterTag = 'all') {
    const grid = document.getElementById('articlesGrid');
    if (!grid) return;

    const filtered = filterTag === 'all'
        ? ARTICLES
        : ARTICLES.filter(a => a.tags.includes(filterTag));

    grid.innerHTML = filtered.map(a => `
    <div class="article-card-small">
      <div class="article-card-small__img">
        <span class="material-icons-round">${a.icon}</span>
      </div>
      <div class="article-card-small__body">
        <div class="article-card-small__cat">${a.category}</div>
        <h4>${a.title}</h4>
        <p>${a.excerpt}</p>
        <div class="article-card-small__footer">
          <div class="article-card-small__author">
            <div class="article-av">${a.author.initials}</div>
            <span>${a.author.name}</span>
          </div>
          <span>${a.readTime} read</span>
        </div>
      </div>
      <a href="${a.url}" style="display:block;padding:0.75rem 1.25rem;border-top:1px solid var(--grey-light);font-size:0.82rem;font-weight:700;color:var(--green);display:flex;align-items:center;gap:0.3rem;">
        Read Article <span class="material-icons-round" style="font-size:0.95rem;">arrow_forward</span>
      </a>
    </div>
  `).join('');
}

// Initialise on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderRelatedArticles();
    renderArticlesGrid('all');

    // Wire up article filter buttons
    document.querySelectorAll('[data-articles-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-articles-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArticlesGrid(btn.dataset.articlesFilter);
        });
    });
});