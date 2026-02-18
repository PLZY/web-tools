export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
        <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left font-medium">
          Built by{" "}
          <a
            href="https://dogupup.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-zinc-300"
          >
            DogUpUp
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/dogupup/devtools"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-zinc-300"
          >
            GitHub
          </a>
          .
        </div>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-right font-medium">
            Keep it simple, keep it fast.
        </p>
      </div>
    </footer>
  );
}
