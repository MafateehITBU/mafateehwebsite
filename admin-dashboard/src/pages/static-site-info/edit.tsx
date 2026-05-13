import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Space,
  Typography,
  Spin,
} from "antd";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getToken } from "../../providers/authProvider";
import { notify } from "../../lib/notify";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type StaticSiteInfoForm = {
  logoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type UploadResponse = {
  url: string;
  publicId: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

// Amman, Jordan
const DEFAULT_CENTER: [number, number] = [31.9539, 35.9106];

const marker = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickPicker = ({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    },
  });
  return null;
};

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const isLocalFakePath = (value: unknown): value is string =>
  typeof value === "string" &&
  (value.startsWith("C:\\fakepath\\") || value.startsWith("file:///"));

export const StaticSiteInfoEdit = () => {
  const { formProps, saveButtonProps, query, form } = useForm<StaticSiteInfoForm>({
    resource: "static_site_info",
  });
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  const logoUrlFromForm = Form.useWatch("logoUrl", form);
  const logoUrlCandidate = uploadedLogoUrl ?? logoUrlFromForm;
  const logoUrl = isLocalFakePath(logoUrlCandidate) ? null : logoUrlCandidate;
  const lat = Form.useWatch("latitude", form);
  const lng = Form.useWatch("longitude", form);
  const center: [number, number] =
    typeof lat === "number" && typeof lng === "number"
      ? [lat, lng]
      : DEFAULT_CENTER;

  const uploadLogoFile = async (file: File) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Missing auth token");
      }
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/upload?folder=static-site", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Logo upload failed");
      }
      const body = (await res.json()) as UploadResponse;
      setUploadedLogoUrl(body.url);
      form.setFieldValue("logoUrl", body.url);
      notify.success("Logo uploaded");
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Logo upload failed");
      notify.error(err.message);
    }
  };

  const mergedFormProps = {
    ...formProps,
    onFinish: async (values: StaticSiteInfoForm) => {
      const safeLogo =
        uploadedLogoUrl ??
        (isLocalFakePath(values.logoUrl) ? null : values.logoUrl) ??
        null;
      const payload = {
        ...values,
        logoUrl: safeLogo,
      };
      return formProps.onFinish?.(payload as never);
    },
  };

  const handleLocationSearch = async () => {
    const q = searchText.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = (await res.json()) as NominatimResult[];
      if (!data.length) {
        notify.warning("No matching location found");
        return;
      }
      const match = data[0];
      const nextLat = Number(match.lat);
      const nextLng = Number(match.lon);
      form.setFieldValue("latitude", Number(nextLat.toFixed(6)));
      form.setFieldValue("longitude", Number(nextLng.toFixed(6)));
      notify.success("Location selected");
    } catch {
      notify.error("Location search failed");
    } finally {
      setSearching(false);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading ?? false}>
      <Form {...mergedFormProps} layout="vertical">
        <Form.Item label="Logo">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              beforeUpload={(file) => {
                void uploadLogoFile(file);
                // fully prevent Upload internal file list/response processing
                return Upload.LIST_IGNORE;
              }}
            >
              <Button>Upload Logo</Button>
            </Upload>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Site logo"
                style={{ maxHeight: 80, width: "auto", objectFit: "contain" }}
              />
            ) : null}
          </Space>
        </Form.Item>
        <Form.Item name="logoUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phoneNumber">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Business hours" name="businessHours">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Location on Map">
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
            Click on the map to set the location. Latitude and longitude are filled automatically.
          </Typography.Paragraph>
          <Space.Compact style={{ width: "100%", marginBottom: 10 }}>
            <Input
              value={searchText}
              placeholder="Search by street, city, area..."
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleLocationSearch}
            />
            <Button onClick={handleLocationSearch} disabled={searching}>
              {searching ? <Spin size="small" /> : "Search"}
            </Button>
          </Space.Compact>
          <MapContainer
            center={center}
            zoom={10}
            style={{ height: 320, width: "100%", borderRadius: 8 }}
          >
            <RecenterMap center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickPicker
              onPick={(nextLat, nextLng) => {
                form.setFieldValue("latitude", nextLat);
                form.setFieldValue("longitude", nextLng);
              }}
            />
            {typeof lat === "number" && typeof lng === "number" ? (
              <Marker position={[lat, lng]} icon={marker} />
            ) : null}
          </MapContainer>
        </Form.Item>
        <Form.Item name="latitude" hidden>
          <InputNumber />
        </Form.Item>
        <Form.Item name="longitude" hidden>
          <InputNumber />
        </Form.Item>
        <Form.Item label="Instagram" name="socialInstagram">
          <Input />
        </Form.Item>
        <Form.Item label="Facebook" name="socialFacebook">
          <Input />
        </Form.Item>
        <Form.Item label="LinkedIn" name="socialLinkedin">
          <Input />
        </Form.Item>
        <Form.Item label="YouTube" name="socialYoutube">
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
