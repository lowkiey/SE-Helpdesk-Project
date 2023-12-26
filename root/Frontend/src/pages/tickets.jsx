import "../stylesheets/auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:3000/api/v1/register";

