import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: object;
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://districtpadel.rs/og-image.jpg",
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const updateOrCreateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    updateOrCreateMeta("description", description);
    updateOrCreateMeta("keywords", keywords);
    updateOrCreateMeta("og:title", title, true);
    updateOrCreateMeta("og:description", description, true);
    updateOrCreateMeta("og:image", ogImage, true);
    updateOrCreateMeta("og:url", canonicalUrl, true);
    updateOrCreateMeta("og:type", "website", true);
    updateOrCreateMeta("twitter:card", "summary_large_image");
    updateOrCreateMeta("twitter:title", title);
    updateOrCreateMeta("twitter:description", description);
    updateOrCreateMeta("twitter:image", ogImage);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"][data-seo-head="true"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-head", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null;
}
