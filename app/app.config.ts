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
            root: " bg-blue-text/70 rounded-full border-1 border-white/20 backdrop-blur-sm shadow-lg",
            item: "min-w-0 py-0 group",
            link: "font-shoulders text-xl text-toned text-white px-4 py-3 group-first:pl-6 group-first:rounded-l-full transition-colors duration-300 ease-out hover:bg-white/10",
            childLink: "font-shoulders text-xl text-toned text-white",
            viewport:
              "bg-blue-text/70 rounded-xl border-1 border-white/20 backdrop-blur-sm shadow-lg",
          },
        },
        {
          orientation: "horizontal",
          variant: "header",
          active: true,
          class: {
            link: "bg-white/30 text-white group-first:rounded-l-full",
            childLink: "before:bg-white/30",
          },
        },
        {
          orientation: "vertical",
          variant: "header",
          class: {
            link: "font-shoulders text-white text-2xl px-4 py-3 transition-colors duration-300 ease-out hover:bg-white/10",
            childList: "border-0",
          },
        },
        {
          orientation: "vertical",
          variant: "header",
          active: true,
          class: {
            link: "bg-white/30",
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
            content: "right-0 inset-y-0 w-full max-w-none bg-blue-text",
            body: "p-0",
          },
        },
      },
    },
  },
});
