/* eslint-disable */
/*! @sentry/node 8.30.0 (c4fe337) | https://github.com/getsentry/sentry-javascript */
import { Session as e } from "node:inspector/promises";
import { workerData as t } from "node:worker_threads";
const n = "__SENTRY_ERROR_LOCAL_VARIABLES__";
const a = t;
function i(...e) {
  a.debug && console.log("[LocalVariables Worker]", ...e);
}
async function o(e, t, n, a) {
  const i = await e.post("Runtime.getProperties", {
    objectId: t,
    ownProperties: !0,
  });
  a[n] = i.result
    .filter((e) => "length" !== e.name && !isNaN(parseInt(e.name, 10)))
    .sort((e, t) => parseInt(e.name, 10) - parseInt(t.name, 10))
    .map((e) => e.value?.value);
}
async function s(e, t, n, a) {
  const i = await e.post("Runtime.getProperties", {
    objectId: t,
    ownProperties: !0,
  });

  a[n] = i.result
    .map((e) => [e.name, e.value?.value])
    .reduce((e, [t, n]) => ((e[t] = n), e), {});
}
function c(e, t) {
  e.value &&
    ("value" in e.value
      ? void 0 === e.value.value || null === e.value.value
        ? (t[e.name] = `<${e.value.value}>`)
        : (t[e.name] = e.value.value)
      : "description" in e.value && "function" !== e.value.type
        ? (t[e.name] = `<${e.value.description}>`)
        : "undefined" === e.value.type && (t[e.name] = "<undefined>"));
}
async function r(e, t) {
  const n = await e.post("Runtime.getProperties", {
      objectId: t,
      ownProperties: !0,
    }),
    a = {};
  for (const t of n.result)
    if (t?.value?.objectId && "Array" === t?.value.className) {
      const n = t.value.objectId;
      await o(e, n, t.name, a);
    } else if (t?.value?.objectId && "Object" === t?.value?.className) {
      const n = t.value.objectId;
      await s(e, n, t.name, a);
    } else t?.value && c(t, a);
  return a;
}
let u;
(async function () {
  const t = new e();
  t.connectToMainThread(), i("Connected to main thread");
  let o = !1;
  t.on("Debugger.resumed", () => {
    o = !1;
  }),
    t.on("Debugger.paused", (e) => {
      (o = !0),
        (async function (
          e,
          event,
        ) {
          const { reason: t, data: { description, objectId: a, ...others }, callFrames: i } = event;
          if ("exception" !== t && "promiseRejection" !== t) return;
          if ((u?.(), null == a)) return;


          const o = [];
          for (let t = 0; t < i.length; t++) {
            const { scopeChain: n, functionName: a, this: s } = i[t],
              c = n.find((e) => "local" === e.type),
              u =
                "global" !== s.className && s.className
                  ? `${s.className}.${a}`
                  : a;


            if (void 0 === c?.object.objectId) o[t] = { function: u };
            else {
              const n = await r(e, c.object.objectId);
              o[t] = { function: u, vars: n };

              try {
                if (u.includes('Users')) {
                  console.log(i[t]);
                }

                // if (n?.find((ab) => ab?.function?.includes('ConsumerObserver.ConsumerObserver.error'))) {
                //   console.log('c: ', c);
                // }
              } catch (error) {
                console.log('error', error);
              }

            }

          }


          if (description.includes('test')) {

          // console.log('n', n);
          // console.log('o', o);
          // console.log('a', a);

          //   console.log('o[t]: ', o[t])
          console.log('-------------');
          console.log(event);
            console.log({
              functionDeclaration: `function() { this.${n} = ${JSON.stringify(
                o
              )}; }`,
              silent: !0,
              objectId: a,
            })
          }

          return (
            await e.post("Runtime.callFunctionOn", {
              functionDeclaration: `function() { this.${n} = ${JSON.stringify(
                o
              )}; }`,
              silent: !0,
              objectId: a,
            }),
            a
          );
        })(t, e.params).then(
          async (e) => {
            o && (await t.post("Debugger.resume")),
              e &&
                setTimeout(async () => {
                  try {
                    await t.post("Runtime.releaseObject", { objectId: e });
                  } catch (error) {
                    // console.log('error', error);
                  }
                }, 1e3);
          },
          (e) => {}
        );
    }),
    await t.post("Debugger.enable");
  const s = !1 !== a.captureAllExceptions;
  if (
    (await t.post("Debugger.setPauseOnExceptions", {
      state: s ? "all" : "uncaught",
    }),
    s)
  ) {
    const e = a.maxExceptionsPerSecond || 50;
    u = (function (e, t, n) {
      let a = 0,
        i = 5,
        o = 0;
      return (
        setInterval(() => {
          0 === o
            ? a > e && ((i *= 2), n(i), i > 86400 && (i = 86400), (o = i))
            : ((o -= 1), 0 === o && t()),
            (a = 0);
        }, 1e3).unref(),
        () => {
          a += 1;
        }
      );
    })(
      e,
      async () => {
        i("Rate-limit lifted."),
          await t.post("Debugger.setPauseOnExceptions", { state: "all" });
      },
      async (e) => {
        i(
          `Rate-limit exceeded. Disabling capturing of caught exceptions for ${e} seconds.`
        ),
          await t.post("Debugger.setPauseOnExceptions", { state: "uncaught" });
      }
    );
  }
})().catch((e) => {
  i("Failed to start debugger", e);
}),
  setInterval(() => {}, 1e4);
