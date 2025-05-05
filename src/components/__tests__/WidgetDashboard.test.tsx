import React from "react";
import {
    render,
    screen,
    act,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import WidgetDashboard from "../WidgetDashboard";
import { EventData } from "../../types/widgets";
import { supabase } from "@/lib/supabase";
