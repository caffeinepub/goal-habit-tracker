import { f as createLucideIcon, r as reactExports, g as useControllableState, j as jsxRuntimeExports, h as createContextScope, i as useId, k as useComposedRefs, l as Primitive, n as composeEventHandlers, o as Presence, p as Portal$2, q as hideOthers, R as ReactRemoveScroll, s as createSlot, t as useFocusGuards, F as FocusScope, D as DismissableLayer, v as cn, w as createSlottable, b as ue, x as CalendarDays, P as Palette, A as AlertDialog, y as AlertDialogTrigger, E as Eraser, z as AlertDialogContent, G as AlertDialogHeader, H as AlertDialogTitle, J as AlertDialogDescription, K as AlertDialogFooter, M as AlertDialogCancel, N as AlertDialogAction, e as Progress, B as Button, C as CirclePlus, O as TriangleAlert, Q as formatTime, S as Trash2, U as Clock, V as ScrollArea, L as Label, I as Input } from "./index-DLAs_Gc6.js";
import { B as Badge } from "./badge-CHsaAkW-.js";
import { C as ChartPie, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, R as ResponsiveContainer, P as PieChart, d as Pie, e as Cell, T as Tooltip$2, L as Legend, f as DialogFooter } from "./PieChart-BO68wdGm.js";
import { c as createPopperScope, R as Root2$1, A as Anchor, C as Content, a as Arrow, b as Root, S as Select, d as SelectTrigger, e as SelectValue, f as SelectContent, g as SelectItem } from "./select-Dsc1j4A2.js";
import { T as Textarea } from "./textarea-DCHM9Df5.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-0LZveikG.js";
import { C as ChevronRight } from "./chevron-right-BCnOjpIP.js";
import { F as Flame } from "./flame-BufIixUk.js";
import { C as CircleCheck } from "./circle-check-D6S-380R.js";
import { P as Pencil } from "./pencil-Vx6XsmJ6.js";
import "./check-CZSheQsr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
var POPOVER_NAME = "Popover";
var [createPopoverContext] = createContextScope(POPOVER_NAME, [
  createPopperScope
]);
var usePopperScope$1 = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = (props) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false
  } = props;
  const popperScope = usePopperScope$1(__scopePopover);
  const triggerRef = reactExports.useRef(null);
  const [hasCustomAnchor, setHasCustomAnchor] = reactExports.useState(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    PopoverProvider,
    {
      scope: __scopePopover,
      contentId: useId(),
      triggerRef,
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      hasCustomAnchor,
      onCustomAnchorAdd: reactExports.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: reactExports.useCallback(() => setHasCustomAnchor(false), []),
      modal,
      children
    }
  ) });
};
Popover$1.displayName = POPOVER_NAME;
var ANCHOR_NAME = "PopoverAnchor";
var PopoverAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props;
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
    const popperScope = usePopperScope$1(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
    reactExports.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
PopoverAnchor.displayName = ANCHOR_NAME;
var TRIGGER_NAME$1 = "PopoverTrigger";
var PopoverTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME$1, __scopePopover);
    const popperScope = usePopperScope$1(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    const trigger = /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
    return context.hasCustomAnchor ? trigger : /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: trigger });
  }
);
PopoverTrigger$1.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "PopoverPortal";
var [PortalProvider$1, usePortalContext$1] = createPopoverContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var PopoverPortal = (props) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME$1, __scopePopover);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider$1, { scope: __scopePopover, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$2, { asChild: true, container, children }) }) });
};
PopoverPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "PopoverContent";
var PopoverContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext$1(CONTENT_NAME$1, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
PopoverContent$1.displayName = CONTENT_NAME$1;
var Slot = createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          if (!isRightClickOutsideRef.current) (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
        }),
        onPointerDownOutside: composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            isRightClickOutsideRef.current = isRightClick;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
var PopoverContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME$1, props.__scopePopover);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a, _b;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a, _b;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var PopoverContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME$1, __scopePopover);
    const popperScope = usePopperScope$1(__scopePopover);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FocusScope,
      {
        asChild: true,
        loop: true,
        trapped: trapFocus,
        onMountAutoFocus: onOpenAutoFocus,
        onUnmountAutoFocus: onCloseAutoFocus,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DismissableLayer,
          {
            asChild: true,
            disableOutsidePointerEvents,
            onInteractOutside,
            onEscapeKeyDown,
            onPointerDownOutside,
            onFocusOutside,
            onDismiss: () => context.onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Content,
              {
                "data-state": getState(context.open),
                role: "dialog",
                id: context.contentId,
                ...popperScope,
                ...contentProps,
                ref: forwardedRef,
                style: {
                  ...contentProps.style,
                  // re-namespace exposed content custom properties
                  ...{
                    "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                  }
                }
              }
            )
          }
        )
      }
    );
  }
);
var CLOSE_NAME = "PopoverClose";
var PopoverClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME, __scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
PopoverClose.displayName = CLOSE_NAME;
var ARROW_NAME$1 = "PopoverArrow";
var PopoverArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props;
    const popperScope = usePopperScope$1(__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
PopoverArrow.displayName = ARROW_NAME$1;
function getState(open) {
  return open ? "open" : "closed";
}
var Root2 = Popover$1;
var Trigger$1 = PopoverTrigger$1;
var Portal$1 = PopoverPortal;
var Content2$1 = PopoverContent$1;
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger$1, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2$1,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
var [createTooltipContext] = createContextScope("Tooltip", [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var PROVIDER_NAME = "TooltipProvider";
var DEFAULT_DELAY_DURATION = 700;
var TOOLTIP_OPEN = "tooltip.open";
var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
var TooltipProvider$1 = (props) => {
  const {
    __scopeTooltip,
    delayDuration = DEFAULT_DELAY_DURATION,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    children
  } = props;
  const isOpenDelayedRef = reactExports.useRef(true);
  const isPointerInTransitRef = reactExports.useRef(false);
  const skipDelayTimerRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipProviderContextProvider,
    {
      scope: __scopeTooltip,
      isOpenDelayedRef,
      delayDuration,
      onOpen: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        isOpenDelayedRef.current = false;
      }, []),
      onClose: reactExports.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(
          () => isOpenDelayedRef.current = true,
          skipDelayDuration
        );
      }, [skipDelayDuration]),
      isPointerInTransitRef,
      onPointerInTransitChange: reactExports.useCallback((inTransit) => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent,
      children
    }
  );
};
TooltipProvider$1.displayName = PROVIDER_NAME;
var TOOLTIP_NAME = "Tooltip";
var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
var Tooltip$1 = (props) => {
  const {
    __scopeTooltip,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    disableHoverableContent: disableHoverableContentProp,
    delayDuration: delayDurationProp
  } = props;
  const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
  const popperScope = usePopperScope(__scopeTooltip);
  const [trigger, setTrigger] = reactExports.useState(null);
  const contentId = useId();
  const openTimerRef = reactExports.useRef(0);
  const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
  const delayDuration = delayDurationProp ?? providerContext.delayDuration;
  const wasOpenDelayedRef = reactExports.useRef(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: (open2) => {
      if (open2) {
        providerContext.onOpen();
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
      } else {
        providerContext.onClose();
      }
      onOpenChange == null ? void 0 : onOpenChange(open2);
    },
    caller: TOOLTIP_NAME
  });
  const stateAttribute = reactExports.useMemo(() => {
    return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
  }, [open]);
  const handleOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    wasOpenDelayedRef.current = false;
    setOpen(true);
  }, [setOpen]);
  const handleClose = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = 0;
    setOpen(false);
  }, [setOpen]);
  const handleDelayedOpen = reactExports.useCallback(() => {
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      wasOpenDelayedRef.current = true;
      setOpen(true);
      openTimerRef.current = 0;
    }, delayDuration);
  }, [delayDuration, setOpen]);
  reactExports.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = 0;
      }
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    TooltipContextProvider,
    {
      scope: __scopeTooltip,
      contentId,
      open,
      stateAttribute,
      trigger,
      onTriggerChange: setTrigger,
      onTriggerEnter: reactExports.useCallback(() => {
        if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
        else handleOpen();
      }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
      onTriggerLeave: reactExports.useCallback(() => {
        if (disableHoverableContent) {
          handleClose();
        } else {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      }, [handleClose, disableHoverableContent]),
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      children
    }
  ) });
};
Tooltip$1.displayName = TOOLTIP_NAME;
var TRIGGER_NAME = "TooltipTrigger";
var TooltipTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...triggerProps } = props;
    const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
    const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onTriggerChange);
    const isPointerDownRef = reactExports.useRef(false);
    const hasPointerMoveOpenedRef = reactExports.useRef(false);
    const handlePointerUp = reactExports.useCallback(() => isPointerDownRef.current = false, []);
    reactExports.useEffect(() => {
      return () => document.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerUp]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        "aria-describedby": context.open ? context.contentId : void 0,
        "data-state": context.stateAttribute,
        ...triggerProps,
        ref: composedRefs,
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          if (event.pointerType === "touch") return;
          if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
            context.onTriggerEnter();
            hasPointerMoveOpenedRef.current = true;
          }
        }),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
          context.onTriggerLeave();
          hasPointerMoveOpenedRef.current = false;
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, () => {
          if (context.open) {
            context.onClose();
          }
          isPointerDownRef.current = true;
          document.addEventListener("pointerup", handlePointerUp, { once: true });
        }),
        onFocus: composeEventHandlers(props.onFocus, () => {
          if (!isPointerDownRef.current) context.onOpen();
        }),
        onBlur: composeEventHandlers(props.onBlur, context.onClose),
        onClick: composeEventHandlers(props.onClick, context.onClose)
      }
    ) });
  }
);
TooltipTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "TooltipPortal";
var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
  forceMount: void 0
});
var TooltipPortal = (props) => {
  const { __scopeTooltip, forceMount, children, container } = props;
  const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeTooltip, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$2, { asChild: true, container, children }) }) });
};
TooltipPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "TooltipContent";
var TooltipContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
    const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
  }
);
var TooltipContentHoverable = reactExports.forwardRef((props, forwardedRef) => {
  const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
  const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const [pointerGraceArea, setPointerGraceArea] = reactExports.useState(null);
  const { trigger, onClose } = context;
  const content = ref.current;
  const { onPointerInTransitChange } = providerContext;
  const handleRemoveGraceArea = reactExports.useCallback(() => {
    setPointerGraceArea(null);
    onPointerInTransitChange(false);
  }, [onPointerInTransitChange]);
  const handleCreateGraceArea = reactExports.useCallback(
    (event, hoverTarget) => {
      const currentTarget = event.currentTarget;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
      setPointerGraceArea(graceArea);
      onPointerInTransitChange(true);
    },
    [onPointerInTransitChange]
  );
  reactExports.useEffect(() => {
    return () => handleRemoveGraceArea();
  }, [handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (trigger && content) {
      const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
      const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
      trigger.addEventListener("pointerleave", handleTriggerLeave);
      content.addEventListener("pointerleave", handleContentLeave);
      return () => {
        trigger.removeEventListener("pointerleave", handleTriggerLeave);
        content.removeEventListener("pointerleave", handleContentLeave);
      };
    }
  }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
  reactExports.useEffect(() => {
    if (pointerGraceArea) {
      const handleTrackPointerGrace = (event) => {
        const target = event.target;
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const hasEnteredTarget = (trigger == null ? void 0 : trigger.contains(target)) || (content == null ? void 0 : content.contains(target));
        const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
        if (hasEnteredTarget) {
          handleRemoveGraceArea();
        } else if (isPointerOutsideGraceArea) {
          handleRemoveGraceArea();
          onClose();
        }
      };
      document.addEventListener("pointermove", handleTrackPointerGrace);
      return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
    }
  }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
});
var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
var Slottable = createSlottable("TooltipContent");
var TooltipContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      children,
      "aria-label": ariaLabel,
      onEscapeKeyDown,
      onPointerDownOutside,
      ...contentProps
    } = props;
    const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const { onClose } = context;
    reactExports.useEffect(() => {
      document.addEventListener(TOOLTIP_OPEN, onClose);
      return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
    }, [onClose]);
    reactExports.useEffect(() => {
      if (context.trigger) {
        const handleScroll = (event) => {
          const target = event.target;
          if (target == null ? void 0 : target.contains(context.trigger)) onClose();
        };
        window.addEventListener("scroll", handleScroll, { capture: true });
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
      }
    }, [context.trigger, onClose]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DismissableLayer,
      {
        asChild: true,
        disableOutsidePointerEvents: false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside: (event) => event.preventDefault(),
        onDismiss: onClose,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            "data-state": context.stateAttribute,
            ...popperScope,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
            ]
          }
        )
      }
    );
  }
);
TooltipContent$1.displayName = CONTENT_NAME;
var ARROW_NAME = "TooltipArrow";
var TooltipArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTooltip, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeTooltip);
    const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
      ARROW_NAME,
      __scopeTooltip
    );
    return visuallyHiddenContentContext.isInside ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
TooltipArrow.displayName = ARROW_NAME;
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const paddedExitPoints = [];
  switch (exitSide) {
    case "top":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y + padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "bottom":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y - padding }
      );
      break;
    case "left":
      paddedExitPoints.push(
        { x: exitPoint.x + padding, y: exitPoint.y - padding },
        { x: exitPoint.x + padding, y: exitPoint.y + padding }
      );
      break;
    case "right":
      paddedExitPoints.push(
        { x: exitPoint.x - padding, y: exitPoint.y - padding },
        { x: exitPoint.x - padding, y: exitPoint.y + padding }
      );
      break;
  }
  return paddedExitPoints;
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
    return upperHull;
  } else {
    return upperHull.concat(lowerHull);
  }
}
var Provider = TooltipProvider$1;
var Root3 = Tooltip$1;
var Trigger = TooltipTrigger$1;
var Portal = TooltipPortal;
var Content2 = TooltipContent$1;
var Arrow2 = TooltipArrow;
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function todayKey() {
  const d = /* @__PURE__ */ new Date();
  return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
}
function compareKeys(a, b) {
  return a.localeCompare(b);
}
function rowsKey(dateKey) {
  return `ssc_routine_day_${dateKey}`;
}
function doneKey(dateKey) {
  return `ssc_routine_done_${dateKey}`;
}
function loadRowsForDay(dateKey) {
  try {
    const saved = localStorage.getItem(rowsKey(dateKey));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
function saveRowsForDay(dateKey, rows) {
  localStorage.setItem(rowsKey(dateKey), JSON.stringify(rows));
}
function loadDoneForDay(dateKey) {
  try {
    const saved = localStorage.getItem(doneKey(dateKey));
    const arr = saved ? JSON.parse(saved) : [];
    return new Set(arr);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function saveDoneForDay(dateKey, done) {
  localStorage.setItem(doneKey(dateKey), JSON.stringify([...done]));
}
function calcDuration(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  return diff > 0 ? diff : 0;
}
function formatDuration(mins) {
  if (mins <= 0) return "–";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}
function sortByTime(rows) {
  return [...rows].sort((a, b) => a.startTime.localeCompare(b.startTime));
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PRIORITY_STYLES = {
  High: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-500",
    label: "High"
  },
  Medium: {
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    label: "Medium"
  },
  Low: {
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Low"
  }
};
const SUBJECT_OPTIONS = [
  "Maths",
  "English",
  "Reasoning",
  "General Knowledge",
  "Current Affairs",
  "Computer",
  "Science",
  "Other (custom)"
];
const ROUTINE_SUBJECT_HEX = {
  Maths: "#e11d48",
  English: "#3b82f6",
  Reasoning: "#a855f7",
  "General Knowledge": "#f59e0b",
  "Current Affairs": "#10b981",
  Computer: "#06b6d4",
  Science: "#22c55e",
  "No Subject": "#6b7280"
};
function emptyForm() {
  return {
    startTime: "",
    endTime: "",
    activity: "",
    subject: "",
    notes: "",
    priority: "Medium"
  };
}
function getDayType(dateKey) {
  const today = todayKey();
  const cmp = compareKeys(dateKey, today);
  if (cmp === 0) return "today";
  if (cmp < 0) return "past";
  return "future";
}
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
function AmPmTimePicker({ value, onChange, label }) {
  const [h, m, ampm] = reactExports.useMemo(() => {
    if (!value) return [12, 0, "AM"];
    const [hh, mm] = value.split(":").map(Number);
    const isPM = hh >= 12;
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return [h12, mm, isPM ? "PM" : "AM"];
  }, [value]);
  const toValue = (hour12, min, ap) => {
    let h24 = hour12 % 12;
    if (ap === "PM") h24 += 12;
    return `${String(h24).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
      label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(h),
          onValueChange: (v) => onChange(toValue(Number(v), m, ampm)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-16 text-sm bg-input border-border px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border max-h-48", children: HOURS_12.map((hr) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(hr), className: "text-sm", children: hr }, hr)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm font-bold", children: ":" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: String(m),
          onValueChange: (v) => onChange(toValue(h, Number(v), ampm)),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-16 text-sm bg-input border-border px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border max-h-48", children: MINUTES.map((min) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(min), className: "text-sm", children: String(min).padStart(2, "0") }, min)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg border border-border overflow-hidden", children: ["AM", "PM"].map((ap) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(toValue(h, m, ap)),
          className: `px-2.5 py-1.5 text-xs font-semibold transition-all ${ampm === ap ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground bg-input"}`,
          children: ap
        },
        ap
      )) })
    ] })
  ] });
}
const START_DATE_KEY = "ssc_routine_start_date";
function getStartDate() {
  return localStorage.getItem(START_DATE_KEY) ?? todayKey();
}
function setStartDate(key) {
  localStorage.setItem(START_DATE_KEY, key);
}
function addDays(dateKey, days) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}
function DailyRoutineTab({
  timeFormat = "12h"
}) {
  const today = /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const [selectedKey, setSelectedKey] = reactExports.useState(todayKey());
  const [rows, setRows] = reactExports.useState(
    () => loadRowsForDay(todayKey())
  );
  const [doneIds, setDoneIds] = reactExports.useState(
    () => loadDoneForDay(todayKey())
  );
  const [calendarOpen, setCalendarOpen] = reactExports.useState(false);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const [subjectSelect, setSubjectSelect] = reactExports.useState("");
  const [customSubject, setCustomSubject] = reactExports.useState("");
  const [copyDialogOpen, setCopyDialogOpen] = reactExports.useState(false);
  const [copyFromDate, setCopyFromDate] = reactExports.useState("");
  const [copyPreviewRows, setCopyPreviewRows] = reactExports.useState([]);
  const [autoCopyPromptOpen, setAutoCopyPromptOpen] = reactExports.useState(false);
  const yesterdayRowsRef = reactExports.useRef([]);
  const [progressChartOpen, setProgressChartOpen] = reactExports.useState(false);
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const [chartDateKey, setChartDateKey] = reactExports.useState(todayKey());
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("dailyroutine");
  const [startDate, setStartDateState] = reactExports.useState(getStartDate);
  const sessionStartRef = reactExports.useRef(Date.now());
  const accIntervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    accIntervalRef.current = setInterval(() => {
      const todayKey2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const k = `ssc_section_time_dailyroutine_${todayKey2}`;
      const current = Number(localStorage.getItem(k) ?? 0);
      localStorage.setItem(k, String(current + 10));
    }, 1e4);
    return () => {
      if (accIntervalRef.current) clearInterval(accIntervalRef.current);
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1e3);
      if (elapsed > 0) {
        const todayKey2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const k = `ssc_section_time_dailyroutine_${todayKey2}`;
        const current = Number(localStorage.getItem(k) ?? 0);
        localStorage.setItem(k, String(current + elapsed % 10));
      }
    };
  }, []);
  const rowsLoadedForKey = reactExports.useRef(null);
  reactExports.useEffect(() => {
    rowsLoadedForKey.current = null;
    const loaded = loadRowsForDay(selectedKey);
    const today2 = todayKey();
    if (selectedKey === today2 && loaded.length === 0) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - 1);
      const yKey = d.toISOString().split("T")[0];
      const yesterdayRows = loadRowsForDay(yKey);
      if (yesterdayRows.length > 0) {
        yesterdayRowsRef.current = yesterdayRows;
        setAutoCopyPromptOpen(true);
      }
    }
    setRows(loaded);
    setDoneIds(loadDoneForDay(selectedKey));
    rowsLoadedForKey.current = selectedKey;
  }, [selectedKey]);
  reactExports.useEffect(() => {
    if (rowsLoadedForKey.current !== selectedKey) return;
    saveRowsForDay(selectedKey, rows);
  }, [rows, selectedKey]);
  reactExports.useEffect(() => {
    if (rowsLoadedForKey.current !== selectedKey) return;
    saveDoneForDay(selectedKey, doneIds);
  }, [doneIds, selectedKey]);
  const dayType = getDayType(selectedKey);
  const canEdit = dayType === "today" || dayType === "future";
  const sorted = reactExports.useMemo(() => sortByTime(rows), [rows]);
  const doneCount = reactExports.useMemo(
    () => sorted.filter((r) => doneIds.has(r.id)).length,
    [sorted, doneIds]
  );
  const totalDuration = reactExports.useMemo(
    () => sorted.reduce((acc, r) => acc + calcDuration(r.startTime, r.endTime), 0),
    [sorted]
  );
  const progressPct = rows.length > 0 ? Math.round(doneCount / rows.length * 100) : 0;
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfMonth(viewYear, viewMonth);
  const monthBadges = reactExports.useMemo(() => {
    const badges = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(viewYear, viewMonth, d);
      const dayRows = loadRowsForDay(key);
      if (dayRows.length > 0) {
        const dayDone = loadDoneForDay(key);
        badges[key] = {
          count: dayRows.length,
          allDone: dayRows.every((r) => dayDone.has(r.id))
        };
      }
    }
    return badges;
  }, [viewYear, viewMonth, daysInMonth]);
  const prevMonth = reactExports.useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);
  const nextMonth = reactExports.useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);
  const selectDay = reactExports.useCallback((key) => {
    setSelectedKey(key);
    setCalendarOpen(false);
  }, []);
  const openAdd = reactExports.useCallback(() => {
    if (!canEdit) return;
    setEditingId(null);
    setForm(emptyForm());
    setSubjectSelect("");
    setCustomSubject("");
    setDialogOpen(true);
  }, [canEdit]);
  const openEdit = reactExports.useCallback(
    (row) => {
      if (!canEdit) return;
      setEditingId(row.id);
      const isPreset = SUBJECT_OPTIONS.slice(0, -1).includes(
        row.subject
      );
      if (isPreset) {
        setSubjectSelect(row.subject);
        setCustomSubject("");
      } else if (row.subject) {
        setSubjectSelect("Other (custom)");
        setCustomSubject(row.subject);
      } else {
        setSubjectSelect("");
        setCustomSubject("");
      }
      setForm({
        startTime: row.startTime,
        endTime: row.endTime,
        activity: row.activity,
        subject: row.subject,
        notes: row.notes,
        priority: row.priority
      });
      setDialogOpen(true);
    },
    [canEdit]
  );
  const handleSave = reactExports.useCallback(() => {
    const resolvedSubject = subjectSelect === "Other (custom)" ? customSubject.trim() : subjectSelect;
    const finalForm = { ...form, subject: resolvedSubject };
    if (!finalForm.activity.trim() || !finalForm.startTime || !finalForm.endTime)
      return;
    if (editingId !== null) {
      setRows(
        (prev) => prev.map((r) => r.id === editingId ? { ...r, ...finalForm } : r)
      );
    } else {
      const newRow = { id: Date.now(), ...finalForm };
      setRows((prev) => [...prev, newRow]);
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setSubjectSelect("");
    setCustomSubject("");
    ue.success(editingId !== null ? "Task updated ✓" : "Task added ✓");
  }, [form, editingId, subjectSelect, customSubject]);
  const handleCopyFromDate = reactExports.useCallback(() => {
    if (!copyFromDate) {
      ue.error("Please select a date to copy from");
      return;
    }
    const sourceRows = loadRowsForDay(copyFromDate);
    if (sourceRows.length === 0) {
      ue.error("No schedule found for that date");
      return;
    }
    const copiedRows = sourceRows.map((r) => ({
      ...r,
      id: Date.now() + Math.random()
    }));
    setRows(copiedRows);
    setDoneIds(/* @__PURE__ */ new Set());
    rowsLoadedForKey.current = selectedKey;
    setCopyDialogOpen(false);
    setCopyFromDate("");
    setCopyPreviewRows([]);
    ue.success(`Schedule copied from ${copyFromDate}!`);
  }, [copyFromDate, selectedKey]);
  const handleAutoCopyConfirm = reactExports.useCallback(() => {
    const copied = yesterdayRowsRef.current.map((r) => ({
      ...r,
      id: Date.now() + Math.random()
    }));
    setRows(copied);
    setDoneIds(/* @__PURE__ */ new Set());
    rowsLoadedForKey.current = selectedKey;
    setAutoCopyPromptOpen(false);
    ue.success("Yesterday's schedule copied for today ✓");
  }, [selectedKey]);
  const handleAutoCopyDecline = reactExports.useCallback(() => {
    setAutoCopyPromptOpen(false);
    rowsLoadedForKey.current = selectedKey;
  }, [selectedKey]);
  const handleDelete = reactExports.useCallback(
    (id) => {
      if (!canEdit) return;
      setRows((prev) => prev.filter((r) => r.id !== id));
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      ue.success("Task removed ✓");
    },
    [canEdit]
  );
  const toggleDone = reactExports.useCallback(
    (id) => {
      if (dayType === "past") return;
      setDoneIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [dayType]
  );
  const duration = calcDuration(form.startTime, form.endTime);
  const selectedDateLabel = reactExports.useMemo(() => {
    const [y, m, d] = selectedKey.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, [selectedKey]);
  const rowsKey2 = rows.map((r) => r.id).join(",");
  const doneKey2 = [...doneIds].sort().join(",");
  const hundredDayData = reactExports.useMemo(() => {
    const today2 = todayKey();
    return Array.from({ length: 100 }, (_, i) => {
      const dateKey = addDays(startDate, i);
      const dayRows = loadRowsForDay(dateKey);
      const dayDone = loadDoneForDay(dateKey);
      const scheduled = dayRows.length;
      const done = dayRows.filter((r) => dayDone.has(r.id)).length;
      const pct = scheduled > 0 ? Math.round(done / scheduled * 100) : 0;
      const isToday = dateKey === today2;
      const isPast = compareKeys(dateKey, today2) < 0;
      const isFuture = compareKeys(dateKey, today2) > 0;
      return {
        dayNum: i + 1,
        dateKey,
        scheduled,
        done,
        pct,
        isToday,
        isPast,
        isFuture
      };
    });
  }, [startDate, rowsKey2, doneKey2]);
  const streak = reactExports.useMemo(() => {
    const today2 = todayKey();
    let s = 0;
    let cursor = today2;
    for (let i = 0; i < 100; i++) {
      const dayRows = loadRowsForDay(cursor);
      const dayDone = loadDoneForDay(cursor);
      if (dayRows.length > 0 && dayRows.every((r) => dayDone.has(r.id))) {
        s++;
        const [y, m, d] = cursor.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        date.setDate(date.getDate() - 1);
        cursor = toDateKey(date.getFullYear(), date.getMonth(), date.getDate());
      } else {
        break;
      }
    }
    return s;
  }, [rowsKey2, doneKey2]);
  const routineChartDataForDate = reactExports.useMemo(() => {
    const dayRows = loadRowsForDay(chartDateKey);
    const dayDone = loadDoneForDay(chartDateKey);
    const map = {};
    for (const r of dayRows) {
      if (dayDone.has(r.id)) {
        const subj = r.subject || "No Subject";
        map[subj] = (map[subj] ?? 0) + 1;
      }
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [chartDateKey]);
  const routineMonthlyChartData = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const todayD = now.getDate();
    const map = {};
    for (let d = 1; d <= todayD; d++) {
      const key = toDateKey(year, month, d);
      const dayRows = loadRowsForDay(key);
      const dayDone = loadDoneForDay(key);
      for (const r of dayRows) {
        if (dayDone.has(r.id)) {
          const subj = r.subject || "No Subject";
          map[subj] = (map[subj] ?? 0) + 1;
        }
      }
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);
  const calendarGrid = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: prevMonth,
          "aria-label": "Previous month",
          className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 15 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xs font-bold text-foreground font-display tracking-wide", children: [
        MONTH_NAMES[viewMonth],
        " ",
        viewYear
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: nextMonth,
          "aria-label": "Next month",
          className: "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 border-b border-border", children: DAY_NAMES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-1.5 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest",
        children: d
      },
      d
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7", children: [
      Array.from({ length: firstDayOfWeek }, (_, i) => DAY_NAMES[i]).map(
        (dayName) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "border-b border-r border-border/30 h-9"
          },
          `blank-${viewYear}-${viewMonth}-${dayName}`
        )
      ),
      Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const key = toDateKey(viewYear, viewMonth, day);
        const isToday = key === todayKey();
        const isSelected = key === selectedKey;
        const badge = monthBadges[key];
        const isPast = compareKeys(key, todayKey()) < 0;
        const isFuture = compareKeys(key, todayKey()) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => selectDay(key),
            "aria-label": `${day} ${MONTH_NAMES[viewMonth]}`,
            className: [
              "relative h-9 flex flex-col items-center justify-center transition-all duration-150",
              "border-b border-r border-border/30",
              isSelected ? "bg-primary/20 ring-2 ring-inset ring-primary z-10" : isToday ? "bg-primary/10" : isPast ? "bg-background/30 hover:bg-accent/20" : isFuture ? "hover:bg-accent/20" : "hover:bg-accent/20",
              (badge == null ? void 0 : badge.allDone) && !isSelected ? "bg-emerald-500/10" : ""
            ].filter(Boolean).join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "text-[11px] font-semibold leading-none",
                    isToday ? "text-primary" : isPast ? "text-muted-foreground/60" : "text-foreground"
                  ].join(" "),
                  children: day
                }
              ),
              badge && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: [
                    "mt-0.5 text-[8px] font-bold px-0.5 rounded-full leading-tight",
                    badge.allDone ? "bg-emerald-500/30 text-emerald-400" : "bg-primary/30 text-primary"
                  ].join(" "),
                  children: badge.count
                }
              ),
              isToday && !isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" })
            ]
          },
          key
        );
      })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-screen bg-background overflow-hidden",
      style: sectionStyle,
      children: [
        showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionStylePanel,
          {
            sectionId: "dailyroutine",
            sectionLabel: "Daily Routine",
            onClose: () => setShowStylePanel(false),
            anchorRef: styleBtnRef
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 py-4 border-b border-border bg-card/40 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 18, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground leading-none font-display", children: "Monthly Routine Scheduler" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Plan, track, and review your daily schedule" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                ref: styleBtnRef,
                type: "button",
                onClick: () => setShowStylePanel((p) => !p),
                className: "w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 flex items-center justify-center transition-colors",
                title: "Customize section style",
                "data-ocid": "routine.style.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setProgressChartOpen(true),
                className: "w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 flex items-center justify-center transition-colors",
                title: "View progress charts",
                "data-ocid": "routine.progress.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              AlertDialog,
              {
                open: showClearConfirm,
                onOpenChange: setShowClearConfirm,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 flex items-center justify-center transition-colors",
                      title: "Clear today's routine status",
                      "data-ocid": "routine.clear.open_modal_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { size: 14 })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "routine.clear.dialog", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Clear today's routine status?" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This will reset all task checkboxes for today. Your tasks will remain but all completion marks will be cleared." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "routine.clear.cancel_button", children: "Cancel" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDialogAction,
                        {
                          onClick: () => {
                            const today2 = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
                            localStorage.removeItem(`ssc_routine_done_${today2}`);
                            ue.success("Today's routine status cleared");
                            setDoneIds(/* @__PURE__ */ new Set());
                          },
                          className: "bg-amber-500 hover:bg-amber-600 text-white",
                          "data-ocid": "routine.clear.confirm_button",
                          children: "Clear"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            ),
            streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { size: 13, className: "text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-amber-400", children: [
                streak,
                " day streak"
              ] })
            ] }),
            rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-primary", children: [
                progressPct,
                "% (",
                doneCount,
                "/",
                rows.length,
                ")"
              ] })
            ] })
          ] }),
          rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: "Today's Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold text-primary font-mono", children: [
                progressPct,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progressPct, className: "h-1.5 bg-muted" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card/60 shrink-0 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: calendarOpen, onOpenChange: setCalendarOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "gap-2 h-8 text-xs font-semibold border-border text-muted-foreground hover:text-foreground shrink-0",
                "data-ocid": "routine.calendar.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "text-primary" }),
                  MONTH_NAMES[viewMonth].slice(0, 3),
                  " ",
                  viewYear
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PopoverContent,
              {
                className: "p-0 bg-card border-border shadow-xl w-auto",
                align: "start",
                children: calendarGrid
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground font-display truncate", children: selectedDateLabel }),
            dayType === "today" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 text-[10px] px-1.5 bg-primary/20 text-primary border-primary/30 border font-semibold shrink-0", children: "Today" }),
            dayType === "past" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 text-[10px] px-1.5 bg-muted/40 text-muted-foreground border-border font-semibold shrink-0", children: "Past" }),
            dayType === "future" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-4 text-[10px] px-1.5 bg-blue-500/20 text-blue-400 border-blue-500/30 border font-semibold shrink-0", children: "Upcoming" }),
            rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground shrink-0", children: [
              rows.length,
              " task",
              rows.length !== 1 ? "s" : "",
              totalDuration > 0 && ` · ${formatDuration(totalDuration)}`,
              " · ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                progressPct,
                "% done"
              ] })
            ] })
          ] }),
          canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setCopyDialogOpen(true),
                size: "sm",
                variant: "outline",
                className: "gap-2 h-8 text-xs font-semibold border-border text-muted-foreground hover:text-foreground",
                "data-ocid": "routine.copy.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }),
                  "Copy From Date"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: openAdd,
                size: "sm",
                className: "gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs font-semibold",
                "data-ocid": "routine.add_task.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 13 }),
                  "Add Task"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
          dayType === "past" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, className: "text-amber-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-400 font-medium", children: "Past Day — Read Only. Data is saved and cannot be edited." })
          ] }),
          dayType === "future" && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-blue-500/8 border-b border-blue-500/15 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 14, className: "text-blue-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-400 font-medium", children: "Plan ahead — tasks added here will be available on this day." })
          ] }),
          sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center flex-1 text-muted-foreground gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 40, className: "opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No tasks scheduled." }),
            canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
              "Click",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: '"Add Task"' }),
              " ",
              "to plan your day."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No data was logged for this day." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 min-h-0 w-full",
              style: { overflowX: "auto", overflowY: "auto" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card/95 backdrop-blur-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-3 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[110px]", children: "Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[150px]", children: "Activity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[100px]", children: "Subject" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20", children: "Duration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-24", children: "Priority" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest min-w-[140px]", children: "Notes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-16", children: "Done" }),
                  canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20", children: "Actions" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((row, idx) => {
                  const done = doneIds.has(row.id);
                  const dur = calcDuration(row.startTime, row.endTime);
                  const pStyle = PRIORITY_STYLES[row.priority];
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: `border-t border-border transition-colors group ${done ? "bg-emerald-500/5 hover:bg-emerald-500/8" : "hover:bg-accent/15"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-muted-foreground font-mono", children: idx + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: `text-xs font-mono font-semibold ${done ? "text-muted-foreground line-through" : "text-foreground"}`,
                            children: [
                              formatTime(row.startTime, timeFormat),
                              " –",
                              " ",
                              formatTime(row.endTime, timeFormat)
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`,
                            children: row.activity
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.subject ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium ${done ? "opacity-50" : ""}`,
                            children: row.subject
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "–" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-mono ${done ? "text-muted-foreground" : "text-foreground"}`,
                            children: formatDuration(dur)
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: `inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-semibold ${pStyle.badge} ${done ? "opacity-50" : ""}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: `w-1.5 h-1.5 rounded-full ${pStyle.dot}`
                                }
                              ),
                              pStyle.label
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs ${done ? "text-muted-foreground/50 line-through" : "text-muted-foreground"} max-w-[180px] block truncate`,
                            title: row.notes,
                            children: row.notes || "–"
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: dayType === "future" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex cursor-not-allowed opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Circle,
                            {
                              size: 20,
                              className: "text-muted-foreground/40"
                            }
                          ) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "text-xs", children: "Available on that day" })
                        ] }) : dayType === "past" ? done ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            size: 20,
                            className: "text-emerald-500/50 mx-auto"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Circle,
                          {
                            size: 20,
                            className: "text-muted-foreground/25 mx-auto"
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleDone(row.id),
                            "aria-label": done ? "Mark as not done" : "Mark as done",
                            className: "transition-all hover:scale-110",
                            children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              CircleCheck,
                              {
                                size: 20,
                                className: "text-emerald-500"
                              }
                            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Circle,
                              {
                                size: 20,
                                className: "text-muted-foreground/40 hover:text-emerald-400 transition-colors"
                              }
                            )
                          }
                        ) }),
                        canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => openEdit(row),
                              "aria-label": "Edit task",
                              className: "p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleDelete(row.id),
                              "aria-label": "Delete task",
                              className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                            }
                          )
                        ] }) })
                      ]
                    },
                    row.id
                  );
                }) })
              ] })
            }
          ),
          sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-border bg-card/60 px-4 py-2 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-semibold", children: "Total scheduled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold text-primary", children: formatDuration(totalDuration) }),
              dayType !== "past" && rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12, className: "text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  doneCount,
                  "/",
                  rows.length,
                  " complete"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-border bg-background", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 15, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground font-display", children: "All Days Progress (100 Days)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-7 text-xs border-border text-muted-foreground hover:text-foreground gap-1.5",
                onClick: () => {
                  const newStart = todayKey();
                  setStartDate(newStart);
                  setStartDateState(newStart);
                  ue.success("100-day tracker reset to today");
                },
                children: "Set Start Date"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-52", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card/95 backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-12", children: "Day" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-16", children: "Sched" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-14", children: "Done" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-20", children: "Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-14", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: hundredDayData.map((entry) => {
              const isSelected = entry.dateKey === selectedKey;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  onClick: () => {
                    if (!entry.isFuture) selectDay(entry.dateKey);
                  },
                  onKeyDown: (e) => {
                    if ((e.key === "Enter" || e.key === " ") && !entry.isFuture) {
                      selectDay(entry.dateKey);
                    }
                  },
                  tabIndex: entry.isFuture ? -1 : 0,
                  className: [
                    "border-t border-border transition-colors cursor-pointer",
                    entry.isToday ? "bg-primary/10 font-semibold" : "",
                    entry.isPast ? "opacity-70" : "",
                    isSelected ? "ring-1 ring-inset ring-primary" : "hover:bg-accent/15"
                  ].filter(Boolean).join(" "),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs font-mono text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      "D",
                      entry.dayNum,
                      entry.isPast && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Lock,
                        {
                          size: 9,
                          className: "text-muted-foreground/40"
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-xs text-foreground", children: [
                      (() => {
                        const [y, m, d] = entry.dateKey.split("-").map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short"
                          }
                        );
                      })(),
                      entry.isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[9px] text-primary font-bold", children: "TODAY" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-center text-muted-foreground font-mono", children: entry.scheduled || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "–" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-center font-mono", children: entry.scheduled > 0 ? entry.done : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "–" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-center", children: entry.scheduled > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full bg-primary rounded-full",
                          style: { width: `${entry.pct}%` }
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono text-primary shrink-0", children: [
                        entry.pct,
                        "%"
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "–" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: entry.scheduled === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "–" }) : entry.pct === 100 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        size: 14,
                        className: "text-emerald-400 mx-auto"
                      }
                    ) : entry.isFuture ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Circle,
                      {
                        size: 14,
                        className: "text-muted-foreground/30 mx-auto"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Circle,
                        {
                          size: 14,
                          className: entry.pct > 0 ? "text-amber-400" : "text-muted-foreground/30"
                        }
                      ),
                      entry.pct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-amber-400 font-bold", children: [
                        entry.pct,
                        "%"
                      ] })
                    ] }) })
                  ]
                },
                entry.dateKey
              );
            }) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: progressChartOpen, onOpenChange: setProgressChartOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-2xl bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 16, className: "text-primary" }),
            "Routine Progress Charts"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Select Date:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  value: chartDateKey,
                  max: todayKey(),
                  onChange: (e) => setChartDateKey(e.target.value),
                  className: "h-8 px-2 text-sm rounded-md border border-input bg-muted/40 text-foreground focus:outline-none focus:border-primary/50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-foreground mb-3 font-display", children: chartDateKey === todayKey() ? "Today's Completed Tasks" : `Tasks Done on ${chartDateKey}` }),
                routineChartDataForDate.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No completed tasks for this date" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Pie,
                    {
                      data: routineChartDataForDate,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 45,
                      outerRadius: 70,
                      paddingAngle: 2,
                      dataKey: "value",
                      children: routineChartDataForDate.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Cell,
                        {
                          fill: ROUTINE_SUBJECT_HEX[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                        },
                        entry.name
                      ))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip$2,
                    {
                      formatter: (value) => [
                        `${value} task${value !== 1 ? "s" : ""}`,
                        ""
                      ],
                      contentStyle: {
                        background: "oklch(0.18 0.01 20)",
                        border: "1px solid oklch(0.3 0.01 20)",
                        borderRadius: "8px",
                        fontSize: "11px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Legend,
                    {
                      iconType: "circle",
                      iconSize: 8,
                      wrapperStyle: { fontSize: "10px", paddingTop: "4px" },
                      formatter: (value) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.8 0.01 60)" }, children: value })
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-bold text-foreground mb-3 font-display", children: [
                  "Monthly Progress (",
                  (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric"
                  }),
                  ")"
                ] }),
                routineMonthlyChartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-44 text-muted-foreground/50 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartPie, { size: 28, className: "opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No completed tasks this month" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 180, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Pie,
                    {
                      data: routineMonthlyChartData,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 45,
                      outerRadius: 70,
                      paddingAngle: 2,
                      dataKey: "value",
                      children: routineMonthlyChartData.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Cell,
                        {
                          fill: ROUTINE_SUBJECT_HEX[entry.name] ?? `hsl(${idx * 60 % 360}, 60%, 55%)`
                        },
                        entry.name
                      ))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Tooltip$2,
                    {
                      formatter: (value) => [
                        `${value} task${value !== 1 ? "s" : ""}`,
                        ""
                      ],
                      contentStyle: {
                        background: "oklch(0.18 0.01 20)",
                        border: "1px solid oklch(0.3 0.01 20)",
                        borderRadius: "8px",
                        fontSize: "11px"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Legend,
                    {
                      iconType: "circle",
                      iconSize: 8,
                      wrapperStyle: { fontSize: "10px", paddingTop: "4px" },
                      formatter: (value) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.8 0.01 60)" }, children: value })
                    }
                  )
                ] }) })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: copyDialogOpen,
            onOpenChange: (open) => {
              setCopyDialogOpen(open);
              if (!open) {
                setCopyFromDate("");
                setCopyPreviewRows([]);
              }
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: "Copy Schedule From Date" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Select a past date to preview its tasks, then copy them to",
                  " ",
                  selectedDateLabel,
                  ". Existing tasks will be replaced."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Source Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "date",
                      value: copyFromDate,
                      max: (() => {
                        const y = /* @__PURE__ */ new Date();
                        y.setDate(y.getDate() - 1);
                        return y.toISOString().split("T")[0];
                      })(),
                      onChange: (e) => {
                        setCopyFromDate(e.target.value);
                        if (e.target.value) {
                          setCopyPreviewRows(loadRowsForDay(e.target.value));
                        } else {
                          setCopyPreviewRows([]);
                        }
                      },
                      className: "h-9 text-sm bg-input border-border"
                    }
                  )
                ] }),
                copyPreviewRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                    "Preview — ",
                    copyPreviewRows.length,
                    " task",
                    copyPreviewRows.length !== 1 ? "s" : "",
                    " found"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-40 rounded-md border border-border bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 space-y-1", children: copyPreviewRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-muted/50",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Clock,
                          {
                            size: 11,
                            className: "text-muted-foreground shrink-0"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground shrink-0", children: [
                          r.startTime,
                          "–",
                          r.endTime
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: r.activity }),
                        r.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "outline",
                            className: "text-[10px] h-4 px-1 shrink-0",
                            children: r.subject
                          }
                        )
                      ]
                    },
                    r.id
                  )) }) })
                ] }),
                copyFromDate && copyPreviewRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No tasks found for this date." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      setCopyDialogOpen(false);
                      setCopyFromDate("");
                      setCopyPreviewRows([]);
                    },
                    className: "text-muted-foreground",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: handleCopyFromDate,
                    disabled: !copyFromDate || copyPreviewRows.length === 0,
                    className: "bg-primary hover:bg-primary/90 text-primary-foreground gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }),
                      "Copy",
                      " ",
                      copyPreviewRows.length > 0 ? `${copyPreviewRows.length} Task${copyPreviewRows.length !== 1 ? "s" : ""}` : "Schedule"
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: autoCopyPromptOpen, onOpenChange: setAutoCopyPromptOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-sm bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 16, className: "text-primary" }),
            "Copy Yesterday's Schedule?"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Today has no tasks yet. Copy yesterday's",
              " ",
              yesterdayRowsRef.current.length,
              " task",
              yesterdayRowsRef.current.length !== 1 ? "s" : "",
              " to today? Checkmarks will be reset."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-32 rounded-md border border-border bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 space-y-1", children: yesterdayRowsRef.current.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs px-2 py-1.5 rounded bg-muted/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Clock,
                    {
                      size: 11,
                      className: "text-muted-foreground shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground shrink-0", children: [
                    r.startTime,
                    "–",
                    r.endTime
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: r.activity }),
                  r.subject && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] h-4 px-1 shrink-0",
                      children: r.subject
                    }
                  )
                ]
              },
              r.id
            )) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: handleAutoCopyDecline,
                className: "text-muted-foreground",
                "data-ocid": "routine.cancel_button",
                children: "No, start fresh"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleAutoCopyConfirm,
                className: "bg-primary hover:bg-primary/90 text-primary-foreground gap-2",
                "data-ocid": "routine.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 }),
                  "Yes, copy tasks"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: dialogOpen && canEdit,
            onOpenChange: (open) => {
              if (!canEdit) return;
              setDialogOpen(open);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: editingId !== null ? "Edit Task" : "Add New Task" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2 pr-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                    "Activity ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. Morning Revision",
                      value: form.activity,
                      onChange: (e) => setForm((f) => ({ ...f, activity: e.target.value })),
                      className: "h-9 text-sm bg-input border-border",
                      autoFocus: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AmPmTimePicker,
                    {
                      value: form.startTime,
                      onChange: (v) => setForm((f) => ({ ...f, startTime: v })),
                      label: "Start Time"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AmPmTimePicker,
                    {
                      value: form.endTime,
                      onChange: (v) => setForm((f) => ({ ...f, endTime: v })),
                      label: "End Time"
                    }
                  )
                ] }),
                duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary font-medium -mt-2", children: [
                  "Duration: ",
                  formatDuration(duration)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Subject" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: subjectSelect,
                        onValueChange: (v) => {
                          setSubjectSelect(v);
                          if (v !== "Other (custom)") {
                            setForm((f) => ({ ...f, subject: v }));
                            setCustomSubject("");
                          } else {
                            setForm((f) => ({
                              ...f,
                              subject: customSubject.trim()
                            }));
                          }
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-sm bg-input border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select subject" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: SUBJECT_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, className: "text-sm", children: s }, s)) })
                        ]
                      }
                    ),
                    subjectSelect === "Other (custom)" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        placeholder: "Enter custom subject...",
                        value: customSubject,
                        onChange: (e) => {
                          setCustomSubject(e.target.value);
                          setForm((f) => ({
                            ...f,
                            subject: e.target.value.trim()
                          }));
                        },
                        className: "h-8 text-sm bg-input border-border mt-1",
                        autoFocus: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Priority" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: form.priority,
                        onValueChange: (v) => setForm((f) => ({ ...f, priority: v })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 text-sm bg-input border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: ["High", "Medium", "Low"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, className: "text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `w-2 h-2 rounded-full ${PRIORITY_STYLES[p].dot}`
                              }
                            ),
                            p
                          ] }) }, p)) })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "Optional notes for this task...",
                      value: form.notes,
                      onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                      className: "text-sm bg-input border-border resize-none",
                      rows: 2
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDialogOpen(false),
                    className: "text-muted-foreground hover:text-foreground",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: handleSave,
                    disabled: !form.activity.trim() || !form.startTime || !form.endTime,
                    className: "bg-primary hover:bg-primary/90 text-primary-foreground gap-2",
                    children: editingId !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 }),
                      "Save Changes"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 13 }),
                      "Add Task"
                    ] })
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  ) });
}
export {
  DailyRoutineTab as default
};
