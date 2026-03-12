import { test, expect } from "@playwright/test";

// ── Expected values (single source of truth for assertions) ─────────────────

const EXPECTED = {
  og: {
    title: "Alexey Minakov | Software Developer - Backend, IoT & Web",
    description:
      "Backend systems, IoT solutions, and web apps built with Python, Arduino, and TypeScript. Explore real-world projects from a developer open to new roles.",
    type: "website",
    url: "https://goodalex223.github.io",
    image: "https://goodalex223.github.io/og-image.png",
    imageWidth: "1200",
    imageHeight: "630",
    imageAlt: "Alexey Minakov - Software Developer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexey Minakov | Software Developer - Backend, IoT & Web",
    description:
      "Backend systems, IoT solutions, and web apps built with Python, Arduino, and TypeScript. Explore real-world projects from a developer open to new roles.",
    image: "https://goodalex223.github.io/og-image.png",
    imageAlt: "Alexey Minakov - Software Developer",
  },
  seo: {
    title: "Alexey Minakov | Software Developer",
    description:
      "Software developer Alexey Minakov — backend systems, IoT/hardware, and web projects built with Python, Arduino, and TypeScript. Available for new opportunities.",
    canonical: "https://goodalex223.github.io",
  },
  jsonLd: {
    context: "https://schema.org",
    person: {
      type: "Person",
      id: "https://goodalex223.github.io/#person",
      name: "Alexey Minakov",
      jobTitle: "Software Developer",
      url: "https://goodalex223.github.io",
      email: "alexminak32@gmail.com",
      description:
        "Software developer specializing in Python backend systems, Arduino-based IoT solutions, and TypeScript web applications. Open to new opportunities.",
      sameAs: [
        "https://github.com/GoodAlex223",
        "https://www.linkedin.com/in/alexey-minakov-302457168",
        "https://t.me/GoodAlex223",
        "https://wokwi.com/makers/goodalex223",
      ],
      knowsAbout: [
        "Python",
        "TypeScript",
        "JavaScript",
        "C++",
        "PostgreSQL",
        "Docker",
        "Arduino",
        "IoT",
        "Backend Development",
        "Web Development",
      ],
    },
    website: {
      type: "WebSite",
      id: "https://goodalex223.github.io/#website",
      name: "Alexey Minakov | Software Developer",
      url: "https://goodalex223.github.io",
      authorId: "https://goodalex223.github.io/#person",
    },
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Read a meta tag's content by property attribute (for OG tags) */
function ogMeta(page, property) {
  return page.locator(`meta[property="${property}"]`);
}

/** Read a meta tag's content by name attribute (for Twitter tags) */
function namedMeta(page, name) {
  return page.locator(`meta[name="${name}"]`);
}

// ── Tests ───────────────────────────────────────────────────────────────────

test.describe("SEO Meta Tags", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ── Open Graph ──────────────────────────────────────────────────────────

  test.describe("Open Graph", () => {
    test("og:title has correct value", async ({ page }) => {
      await expect(ogMeta(page, "og:title")).toHaveAttribute(
        "content",
        EXPECTED.og.title,
      );
    });

    test("og:description has correct value", async ({ page }) => {
      await expect(ogMeta(page, "og:description")).toHaveAttribute(
        "content",
        EXPECTED.og.description,
      );
    });

    test("og:type is website", async ({ page }) => {
      await expect(ogMeta(page, "og:type")).toHaveAttribute(
        "content",
        EXPECTED.og.type,
      );
    });

    test("og:url is canonical URL", async ({ page }) => {
      await expect(ogMeta(page, "og:url")).toHaveAttribute(
        "content",
        EXPECTED.og.url,
      );
    });

    test("og:image is absolute URL", async ({ page }) => {
      await expect(ogMeta(page, "og:image")).toHaveAttribute(
        "content",
        EXPECTED.og.image,
      );
    });

    test("og:image:width is 1200", async ({ page }) => {
      await expect(ogMeta(page, "og:image:width")).toHaveAttribute(
        "content",
        EXPECTED.og.imageWidth,
      );
    });

    test("og:image:height is 630", async ({ page }) => {
      await expect(ogMeta(page, "og:image:height")).toHaveAttribute(
        "content",
        EXPECTED.og.imageHeight,
      );
    });

    test("og:image:alt has correct value", async ({ page }) => {
      await expect(ogMeta(page, "og:image:alt")).toHaveAttribute(
        "content",
        EXPECTED.og.imageAlt,
      );
    });
  });

  // ── Twitter Card ────────────────────────────────────────────────────────

  test.describe("Twitter Card", () => {
    test("twitter:card is summary_large_image", async ({ page }) => {
      await expect(namedMeta(page, "twitter:card")).toHaveAttribute(
        "content",
        EXPECTED.twitter.card,
      );
    });

    test("twitter:title has correct value", async ({ page }) => {
      await expect(namedMeta(page, "twitter:title")).toHaveAttribute(
        "content",
        EXPECTED.twitter.title,
      );
    });

    test("twitter:description has correct value", async ({ page }) => {
      await expect(namedMeta(page, "twitter:description")).toHaveAttribute(
        "content",
        EXPECTED.twitter.description,
      );
    });

    test("twitter:image is absolute URL", async ({ page }) => {
      await expect(namedMeta(page, "twitter:image")).toHaveAttribute(
        "content",
        EXPECTED.twitter.image,
      );
    });

    test("twitter:image:alt has correct value", async ({ page }) => {
      await expect(namedMeta(page, "twitter:image:alt")).toHaveAttribute(
        "content",
        EXPECTED.twitter.imageAlt,
      );
    });
  });

  // ── Core SEO ────────────────────────────────────────────────────────────

  test.describe("Core SEO", () => {
    test("page title has correct value", async ({ page }) => {
      await expect(page).toHaveTitle(EXPECTED.seo.title);
    });

    test("meta description has correct value", async ({ page }) => {
      await expect(namedMeta(page, "description")).toHaveAttribute(
        "content",
        EXPECTED.seo.description,
      );
    });

    test("canonical link is correct URL", async ({ page }) => {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        EXPECTED.seo.canonical,
      );
    });
  });

  // ── JSON-LD Structured Data ─────────────────────────────────────────────

  test.describe("JSON-LD Structured Data", () => {
    /** Parse JSON-LD graph from the page (isolated per test call) */
    async function getGraph(page) {
      const raw = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      return JSON.parse(raw);
    }

    test("uses schema.org context", async ({ page }) => {
      const data = await getGraph(page);
      expect(data["@context"]).toBe(EXPECTED.jsonLd.context);
    });

    test.describe("Person schema", () => {
      test("has correct @type and @id", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person).toBeDefined();
        expect(person["@id"]).toBe(EXPECTED.jsonLd.person.id);
      });

      test("has correct name and jobTitle", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person.name).toBe(EXPECTED.jsonLd.person.name);
        expect(person.jobTitle).toBe(EXPECTED.jsonLd.person.jobTitle);
      });

      test("has correct url and email", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person.url).toBe(EXPECTED.jsonLd.person.url);
        expect(person.email).toBe(EXPECTED.jsonLd.person.email);
      });

      test("description matches expected", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person.description).toBe(EXPECTED.jsonLd.person.description);
      });

      test("sameAs contains all 4 profile URLs", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person.sameAs).toEqual(EXPECTED.jsonLd.person.sameAs);
      });

      test("knowsAbout contains all 10 skills", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const person = graph.find((n) => n["@type"] === "Person");
        expect(person.knowsAbout).toEqual(EXPECTED.jsonLd.person.knowsAbout);
      });
    });

    test.describe("WebSite schema", () => {
      test("has correct @type, @id, name, and url", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const website = graph.find((n) => n["@type"] === "WebSite");
        expect(website).toBeDefined();
        expect(website["@id"]).toBe(EXPECTED.jsonLd.website.id);
        expect(website.name).toBe(EXPECTED.jsonLd.website.name);
        expect(website.url).toBe(EXPECTED.jsonLd.website.url);
      });

      test("author references Person by @id", async ({ page }) => {
        const graph = (await getGraph(page))["@graph"];
        const website = graph.find((n) => n["@type"] === "WebSite");
        expect(website.author["@id"]).toBe(EXPECTED.jsonLd.website.authorId);
      });
    });
  });

  // ── Cross-tag Consistency ───────────────────────────────────────────────

  test.describe("Cross-tag Consistency", () => {
    test("og:title matches twitter:title", async ({ page }) => {
      const ogTitle = await ogMeta(page, "og:title").getAttribute("content");
      const twTitle = await namedMeta(page, "twitter:title").getAttribute(
        "content",
      );
      expect(ogTitle).not.toBeNull();
      expect(ogTitle).toBe(twTitle);
    });

    test("og:description matches twitter:description", async ({ page }) => {
      const ogDesc = await ogMeta(page, "og:description").getAttribute(
        "content",
      );
      const twDesc = await namedMeta(page, "twitter:description").getAttribute(
        "content",
      );
      expect(ogDesc).not.toBeNull();
      expect(ogDesc).toBe(twDesc);
    });

    test("og:image matches twitter:image", async ({ page }) => {
      const ogImg = await ogMeta(page, "og:image").getAttribute("content");
      const twImg = await namedMeta(page, "twitter:image").getAttribute(
        "content",
      );
      expect(ogImg).not.toBeNull();
      expect(ogImg).toBe(twImg);
    });

    test("og:image:alt matches twitter:image:alt", async ({ page }) => {
      const ogAlt = await ogMeta(page, "og:image:alt").getAttribute("content");
      const twAlt = await namedMeta(page, "twitter:image:alt").getAttribute(
        "content",
      );
      expect(ogAlt).not.toBeNull();
      expect(ogAlt).toBe(twAlt);
    });

    test("og:url matches canonical href", async ({ page }) => {
      const ogUrl = await ogMeta(page, "og:url").getAttribute("content");
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(ogUrl).not.toBeNull();
      expect(ogUrl).toBe(canonical);
    });
  });
});
