import { createSearchAPI } from "fumadocs-core/search/server";
import { readFile } from "node:fs/promises";
import { catalog, guides } from "@/lib/catalog";
export const { GET } = createSearchAPI("simple", {
  indexes: async () =>
    Promise.all(
      [...catalog, ...guides].map(async (page) => {
        const item = catalog.find((c) => c.slug === page.slug);
        return {
          title: page.title,
          url: `/docs/${page.slug}`,
          description: item?.description ?? "Fabrials UI guide",
          content:
            (item
              ? `${item.description} ${item.note} ${item.props.flat().join(" ")}`
              : "") +
            " " +
            (await readFile(`content/${page.slug}.mdx`, "utf8").catch(
              () => "",
            )),
        };
      }),
    ),
});
