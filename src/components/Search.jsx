import { useEffect, useId, useState, forwardRef, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import { createAutocomplete } from '@algolia/autocomplete-core'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'
import Highlighter from 'react-highlight-words'
import { navigation } from '@/components/Layout'

function SearchIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
    </svg>
  )
}

function useAutocomplete() {
  let id = useId()
  let router = useRouter()
  let [autocompleteState, setAutocompleteState] = useState({})

  let [autocomplete] = useState(() =>
    createAutocomplete({
      id,
      placeholder: 'Find something...',
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state)
      },
      shouldPanelOpen({ state }) {
        return state.query !== ''
      },
      getSources({ query }) {
        return import('@/markdoc/search.mjs').then(({ search }) => {
          return [
            {
              sourceId: 'documentation',
              getItems() {
                return search(query, { limit: 5 })
              },
              getItemUrl({ item }) {
                return item.url
              },
              onSelect({ itemUrl }) {
                router.push(itemUrl)
              },
            },
          ]
        })
      },
    })
  )

  return { autocomplete, autocompleteState }
}

function LoadingIcon(props) {
  let id = useId()

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function HighlightQuery({ text, query }) {
  return (
    <Highlighter
      highlightClassName="group-aria-selected:underline bg-transparent text-primary dark:text-darkprimary"
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  )
}

function SearchResult({ result, autocomplete, collection, query }) {
  let id = useId()

  let sectionTitle
  if (navigation) {
    sectionTitle = navigation.find((section) =>
      section.links.find((link) => link.href === result.url.split('#')[0])
    )?.title
  }
  let hierarchy = [sectionTitle, result.pageTitle].filter(Boolean)

  return (
    <li
      className="group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/30"
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className="text-sm text-slate-700 group-aria-selected:text-primary dark:text-white/50 dark:group-aria-selected:text-white/50"
      >
        <HighlightQuery text={result.title} query={query} />
      </div>
      {hierarchy.length > 0 && (
        <div
          id={`${id}-hierarchy`}
          aria-hidden="true"
          className="mt-0.5 truncate whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
        >
          {hierarchy.map((item, itemIndex, items) => (
            <Fragment key={itemIndex}>
              <HighlightQuery text={item} query={query} />
              <span
                className={
                  itemIndex === items.length - 1
                    ? 'sr-only'
                    : 'mx-2 text-slate-300 dark:text-slate-700'
                }
              >
                /
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </li>
  )
}

function SearchResults({ autocomplete, query, collection }) {
  if (collection.items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-700 dark:text-slate-400">
        No results for &ldquo;
        <span className="break-words text-primary dark:text-darkprimary">
          {query}
        </span>
        &rdquo;
      </p>
    )
  }

  return (
    <ul role="list" {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          key={result.url}
          result={result}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  )
}

const SearchInput = forwardRef(function SearchInput(
  { autocomplete, autocompleteState, onClose },
  inputRef
) {
  let inputProps = autocomplete.getInputProps({})

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-4 top-0 h-full w-5 fill-slate-400 dark:fill-slate-500" />
      <input
        ref={inputRef}
        className={clsx(
          'flex-auto appearance-none bg-transparent pl-12 text-slate-900 outline-none placeholder:text-slate-400 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
          autocompleteState.status === 'stalled' ? 'pr-11' : 'pr-4'
        )}
        {...inputProps}
        onKeyDown={(event) => {
          if (
            event.key === 'Escape' &&
            !autocompleteState.isOpen &&
            autocompleteState.query === ''
          ) {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            document.activeElement?.blur()

            onClose()
          } else {
            inputProps.onKeyDown(event)
          }
        }}
      />
      {autocompleteState.status === 'stalled' && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-6 w-6 animate-spin stroke-slate-200 text-slate-400 dark:stroke-slate-700 dark:text-slate-500" />
        </div>
      )}
    </div>
  )
})

function SearchDialog({ open, setOpen, className }) {
  let router = useRouter()
  let formRef = useRef()
  let panelRef = useRef()
  let inputRef = useRef()
  let { autocomplete, autocompleteState } = useAutocomplete()

  useEffect(() => {
    if (!open) {
      return
    }

    function onRouteChange() {
      setOpen(false)
    }

    router.events.on('routeChangeStart', onRouteChange)
    router.events.on('hashChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
      router.events.off('hashChangeStart', onRouteChange)
    }
  }, [open, setOpen, router])

  useEffect(() => {
    if (open) {
      return
    }

    function onKeyDown(event) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, setOpen])

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
        autocomplete.setQuery('')
      }}
      className={clsx('fixed inset-0 z-50', className)}
    >
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur" />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
        <Dialog.Panel className="mx-auto overflow-hidden rounded-xl bg-white shadow-xl dark:bg-slate-800 dark:ring-1 dark:ring-slate-700 sm:max-w-xl">
          <div {...autocomplete.getRootProps({})}>
            <form
              ref={formRef}
              {...autocomplete.getFormProps({
                inputElement: inputRef.current,
              })}
            >
              <SearchInput
                ref={inputRef}
                autocomplete={autocomplete}
                autocompleteState={autocompleteState}
                onClose={() => setOpen(false)}
              />
              <div
                ref={panelRef}
                className="border-t border-slate-200 bg-white px-2 py-3 empty:hidden dark:border-slate-400/10 dark:bg-slate-800"
                {...autocomplete.getPanelProps({})}
              >
                {autocompleteState.isOpen && (
                  <SearchResults
                    autocomplete={autocomplete}
                    query={autocompleteState.query}
                    collection={autocompleteState.collections[0]}
                  />
                )}
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

function useSearchProps() {
  let buttonRef = useRef()
  let [open, setOpen] = useState(false)

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true)
      },
    },
    dialogProps: {
      open,
      setOpen(open) {
        let { width, height } = buttonRef.current.getBoundingClientRect()
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open)
        }
      },
    },
  }
}

export function Search() {
  let [modifierKey, setModifierKey] = useState()
  let { buttonProps, dialogProps } = useSearchProps()

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl '
    )
  }, [])

  return (
    <>
      <button
        type="button"
        className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded md:py-1.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-lightgray md:hover:ring-primaryhover dark:md:ring-inset dark:md:ring-white/50 dark:md:hover:ring-slate-500 lg:w-64"
        {...buttonProps}
      >
        <SearchIcon className="h-4 w-4 flex-none fill-lightgray dark:fill-white/50  " />
        <span className="sr-only md:not-sr-only md:ml-2 md:text-lightgray md:dark:text-white/50">
          Search
        </span>
        {modifierKey && (
          <kbd className="ml-auto hidden gap-x-2 text-xs  font-medium text-lightgray  dark:text-white/50 md:flex">
            <kbd className="rounded border border-lightgray px-2 py-0.5 font-sans dark:border-slate-500 dark:border-white/50">
              {modifierKey}
            </kbd>
            <kbd className="rounded border border-lightgray px-2 py-0.5 font-sans dark:border-slate-500 dark:border-white/50">
              K
            </kbd>
          </kbd>
        )}
      </button>
      <SearchDialog {...dialogProps} />
    </>
  )
}
