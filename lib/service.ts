import { Observable, Subject } from 'rxjs'
import { Container, ServiceClassInstance } from './container'

/**
 * A Dioc service that can bound to a container and can bind dependency services.
 *
 * NOTE: Services have a constructor that take a single argument that is the container. This should always be maintained
 * since that is expected for binding to containers.
 *
 * @template EventDef The type of events that can be emitted by the service. These will be accessible by event streams
 */
export abstract class Service<EventDef = {}> {

  /**
   * The internal event stream of the service
   */
  private event$ = new Subject<EventDef>()

  /** The container the service is bound to */
  #container: Container

  constructor(container: Container) {
    this.#container = container
  }

  /**
   * This function is called when a service is initialized, which is only
   * once per container since services are singletons. By
   * default this function does nothing and is expected to be overriden by
   * services if they want to do like in place of a constructor.
   *
   * NOTE: The reason why this function exists is so that constructors for
   * services need not be exposed and played around with. By norm, it is best
   * to override this function than overriding the constructor and providing the
   * container that way.
   */
  public onServiceInit() {
    // NOOP. This function is expected to be overriden if something is needed to be done
  }

  /**
   * Binds a dependency service into this service.
   * @param service The class reference of the service to bind
   */
  protected bind<T extends ServiceClassInstance<any>>(service: T): InstanceType<T> {
    return this.#container.bind(service, this.constructor as ServiceClassInstance<EventDef>)
  }

  /**
   * Returns the container the service is bound to
   */
  protected getContainer(): Container {
    return this.#container
  }

  /**
   * Emits an event on the service's event stream
   * @param event The event to emit
   */
  protected emit(event: EventDef) {
    this.event$.next(event)
  }

  /**
   * Returns the event stream of the service
   */
  public getEventStream(): Observable<EventDef> {
    return this.event$.asObservable()
  }
}
