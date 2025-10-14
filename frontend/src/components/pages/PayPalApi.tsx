import { useEffect, useRef } from "react";

interface PayPalProps {
  value: number;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PayPalButton(props: PayPalProps) {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paypalRef.current) return;

    // Limpiar cualquier botón anterior
    paypalRef.current.innerHTML = "";

    if (!window.paypal) {
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AVixVwc7nZPKQxQ84Qhm6KPOohKDAtxg0JzOcID5qeGhdHcWJH7nC8d0rPVCCTLoTfkHtLMJMWHlFF3r&currency=USD";
      script.async = true;
      script.onload = () => renderPayPalButton();
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }

    function renderPayPalButton() {
      window.paypal
        .Buttons({
          createOrder: (_: any, actions: any) => {
            const amount = props.value > 0 ? props.value.toFixed(2) : "0.00";
            return actions.order.create({
              purchase_units: [
                {
                  amount: { value: amount },
                },
              ],
            });
          },
          onApprove: (_: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert("Pago completado por " + details.payer.name.given_name);
            });
          },
          onError: (err: any) => {
            console.error(err);
          },
        })
        .render(paypalRef.current);
    }
  }, [props.value]);

  return <div ref={paypalRef}></div>;
}
