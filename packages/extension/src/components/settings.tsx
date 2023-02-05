import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ExtensionSettingKey,
  ExtensionSettings,
} from "@analytics/shared/types";
import {
  Dropdown,
  Input,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Toggle,
} from "@analytics/ui";

export default function Settings({
  settings,
  updateSetting,
}: {
  settings: ExtensionSettings;
  updateSetting: (
    key: ExtensionSettingKey,
    enabled: boolean,
    value?: string
  ) => void;
}) {
  const settingsKeys = useMemo(
    () =>
      Object.keys(settings).sort((a, b) =>
        a.toLowerCase() > b.toLowerCase() ? 1 : -1
      ) as ExtensionSettingKey[],
    [settings]
  );
  const [location, setLocation] = useState<string | undefined>();

  useEffect(() => {
    if (settings.location.enabled && !location) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude} ${position.coords.longitude}`);
      });
    }
  }, [settings]);

  useEffect(() => {
    if (location && settings.location.enabled) {
      updateSetting("location", true, location);
    }
  }, [settings, location]);

  function SettingsValue(key: ExtensionSettingKey) {
    const setting = settings[key];
    switch (key) {
      case "age":
        return (
          <Input
            placeholder="-"
            className="w-[88px] text-xs text-center"
            disabled={!setting.enabled}
            type="number"
            name="age"
            min="1"
            max={150}
            maxLength={3}
            size={3}
            value={setting.value}
            onChange={(e) =>
              updateSetting(key, true, (e.target as HTMLInputElement).value)
            }
          />
        );
      case "gender":
        return (
          <Dropdown
            value={setting.value ?? "Select"}
            defaultValue="Select"
            options={["Male", "Female", "Other"]}
            onChange={(gender) => updateSetting(key, true, gender)}
            disabled={!setting.enabled}
          />
        );
      default:
        return <p className="line-clamp-2">{setting.value ?? "-"}</p>;
    }
  }

  return (
    <Table>
      <TableBody className="max-h-[200px]">
        {settingsKeys.map((key, i) => {
          const setting = settings[key];
          return (
            <TableRow className="h-[50px] px-4 text-sm" key={key} i={i}>
              <TableCell className="w-[80px] h-full">
                <p className="capitalize">{key}</p>
              </TableCell>
              <TableCell className="flex items-center h-full pl-2 pr-1">
                <div className="text-gray-500 text-xs overflow-hidden">
                  {SettingsValue(key)}
                </div>
              </TableCell>
              <TableCell align="right" className="w-[75px] h-full">
                <Toggle
                  checked={setting.enabled}
                  onChange={(checked) => updateSetting(key, checked)}
                  srMsg={`Enable ${key}`}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
