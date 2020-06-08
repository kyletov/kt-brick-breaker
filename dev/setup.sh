#!/bin/bash
cat schema.sql | heroku pg:psql -a kt-brick-breaker
