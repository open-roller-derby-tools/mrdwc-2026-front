export default defineAppConfig({
  ui: {
    navigationMenu: {
      variants: {
        variant: {
          header: "",
        },
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          variant: "header",
          class: {
            root: "bg-blue-text/85 rounded-full border-2 border-white/20",
            item: "min-w-0 py-0 group",
            link: "font-shoulders text-xl text-toned px-4 py-3 group-first:pl-6",
          },
        },
        {
          orientation: "horizontal",
          variant: "header",
          active: true,
          class: {
            link: "bg-white/20 text-highlighted group-first:rounded-l-full",
          },
        },
        {
          orientation: "vertical",
          variant: "header",
          class: {
            link: "font-shoulders text-2xl text-toned px-4 py-3",
          },
        },
      ],
    },
    button: {
      variants: {
        size: {
          xxl: {
            base: "px-4 py-3",
            leadingIcon: "size-8",
            trailingIcon: "size-8",
          },
        },
      },
    },
    slideover: {
      variants: {
        side: {
          right: {
            content: "right-0 inset-y-0 w-full max-w-none",
          },
        },
      },
    },
  },
});
