export class RouterEvent {
  constructor(public url: string) {}
}

export class NavigationStart extends RouterEvent {}

export class NavigationEnd extends RouterEvent {}

export class NavigationCancel extends RouterEvent {}

export class NavigationError extends RouterEvent {
  constructor(
    url: string,
    public error: unknown,
  ) {
    super(url)
  }
}
