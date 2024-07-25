import ChampionshipMenuButton from "@/components/championship/register/menu/ChampionshipMenuButton";
import InvoiceTable from "@/components/payment/InvoiceTable";
import PaidTable from "@/components/payment/PaidTable";
import PaymentInvoice from "@/components/payment/PaymentInvoice";
import TestPaymentInvoice from "@/components/payment/PaymentInvoice";
import UnpaidTable from "@/components/payment/UnpaidTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pembayaran",
};

const TabsListComp = () => {
  return (
    <>
      {/* TABS LIST DESKTOP */}
      <TabsList className="hidden sm:flex">
        <TabsTrigger value="unpaid">Menunggu Pembayaran</TabsTrigger>
        <TabsTrigger value="unconfirmed">Menunggu Konfirmasi</TabsTrigger>
        <TabsTrigger value="confirmed">Pembayaran Selesai</TabsTrigger>
        <TabsTrigger value="invoice">Invoice</TabsTrigger>
      </TabsList>
      {/* TABS LIST MOBILE */}
      <div className="block sm:hidden">
        <TabsList className="w-full">
          <Select>
            <SelectTrigger className="flex justify-center w-full">
              <SelectValue placeholder="Menunggu Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="text-center *:block">
                <TabsTrigger value="unpaid" asChild>
                  <SelectItem value="unpaid">Menunggu Pembayaran</SelectItem>
                </TabsTrigger>
                <TabsTrigger value="unconfirmed" asChild>
                  <SelectItem value="unconfirmed">
                    Menunggu Konfirmasi
                  </SelectItem>
                </TabsTrigger>
                <TabsTrigger value="confirmed" asChild>
                  <SelectItem value="confirmed">Pembayaran Selesai</SelectItem>
                </TabsTrigger>
                <TabsTrigger value="invoice" asChild>
                  <SelectItem value="invoice">Invoice</SelectItem>
                </TabsTrigger>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TabsList>
      </div>
    </>
  );
};

const page = ({ params }: { params: { eventId: string } }) => {
  return (
    <div>
      <Tabs defaultValue="unpaid" className="flex flex-col">
        <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between gap-y-1 flex-wrap">
          <div className="flex items-center">
            <ChampionshipMenuButton />
            <h1 className="font-semibold text-3xl flex-1 text-center">
              Pembayaran
            </h1>
          </div>
          <TabsListComp />
        </div>
        <div className="registration_content flex-1">
          <TabsContent value="unpaid" className="registration_content">
            <UnpaidTable championshipId={params.eventId} />
          </TabsContent>
          <TabsContent value="unconfirmed">
            <PaidTable />
          </TabsContent>
          <TabsContent value="confirmed">
            <PaidTable confirmed />
          </TabsContent>
          <TabsContent value="invoice">
            <InvoiceTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
export default page;
